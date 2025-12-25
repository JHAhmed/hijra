import { json } from '@sveltejs/kit';
import { tablesDB, ID, Query } from '$lib/server/appwrite.js';

const DATABASE_ID = 'hijrah';
const TABLE_ID = 'pilgrim_tracking';

/**
 * Generate a unique tracking code like "HJR-A23K9"
 */
function generateTrackingCode() {
	const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude confusing chars
	let code = 'HJR-';
	for (let i = 0; i < 5; i++) {
		code += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return code;
}

/**
 * POST /api/tracking
 * Create a new tracking session OR get existing session for user
 * If userId is provided, uses that as the document ID (one session per user)
 */
export async function POST({ request }) {
	try {
		const { pilgrimName, userId } = await request.json();

		if (!pilgrimName || pilgrimName.trim().length === 0) {
			return json({ error: 'Pilgrim name is required' }, { status: 400 });
		}

		// If userId is provided, check if a session already exists
		if (userId) {
			try {
				const existing = await tablesDB.getRow(DATABASE_ID, TABLE_ID, userId);
				if (existing) {
					// Session exists - check if expired and refresh if needed
					const expiresAt = new Date(existing.expiresAt);
					const now = new Date();

					if (expiresAt < now) {
						// Expired - update with new expiry
						const newExpiry = new Date();
						newExpiry.setDate(newExpiry.getDate() + 7);

						await tablesDB.updateRow(DATABASE_ID, TABLE_ID, userId, {
							expiresAt: newExpiry.toISOString(),
							isActive: true,
							pilgrimName: pilgrimName.trim()
						});

						return json({
							success: true,
							trackingCode: existing.trackingCode,
							trackingId: userId,
							expiresAt: newExpiry.toISOString(),
							isExisting: true,
							wasExpired: true
						});
					}

					// Session exists and not expired - return it
					return json({
						success: true,
						trackingCode: existing.trackingCode,
						trackingId: userId,
						expiresAt: existing.expiresAt,
						isActive: existing.isActive,
						currentActivity: existing.currentActivity,
						isExisting: true
					});
				}
			} catch (e) {
				// Row doesn't exist, will create new one below
			}
		}

		// Generate unique tracking code
		let trackingCode = generateTrackingCode();
		let attempts = 0;
		const maxAttempts = 5;

		// Ensure code is unique
		while (attempts < maxAttempts) {
			const existing = await tablesDB.listRows(DATABASE_ID, TABLE_ID, [
				Query.equal('trackingCode', trackingCode)
			]);

			if (!existing.rows || existing.rows.length === 0) {
				break;
			}

			trackingCode = generateTrackingCode();
			attempts++;
		}

		if (attempts >= maxAttempts) {
			return json({ error: 'Failed to generate unique tracking code' }, { status: 500 });
		}

		// Set expiry to 7 days from now
		const expiresAt = new Date();
		expiresAt.setDate(expiresAt.getDate() + 7);

		// Use userId as document ID if provided, otherwise generate unique ID
		const documentId = userId || ID.unique();

		const row = await tablesDB.createRow(DATABASE_ID, TABLE_ID, documentId, {
			trackingCode,
			pilgrimName: pilgrimName.trim(),
			latitude: null,
			longitude: null,
			currentActivity: null,
			lastUpdated: null,
			isActive: true,
			expiresAt: expiresAt.toISOString(),
			$createdAt: new Date().toISOString()
		});

		return json({
			success: true,
			trackingCode,
			trackingId: row.$id,
			expiresAt: expiresAt.toISOString(),
			isExisting: false
		});
	} catch (error) {
		console.error('Failed to create tracking session:', error);
		return json(
			{ error: 'Failed to create tracking session', details: error.message },
			{ status: 500 }
		);
	}
}

/**
 * GET /api/tracking
 * List all tracking sessions (for future admin use)
 */
export async function GET({ url }) {
	try {
		const activeOnly = url.searchParams.get('activeOnly') === 'true';
		const userId = url.searchParams.get('userId');

		const queries = [];
		if (activeOnly) {
			queries.push(Query.equal('isActive', true));
		}

		// If userId is provided, try to get that specific session
		if (userId) {
			try {
				const session = await tablesDB.getRow(DATABASE_ID, TABLE_ID, userId);
				return json({
					success: true,
					session
				});
			} catch (e) {
				return json({
					success: true,
					session: null
				});
			}
		}

		const result = await tablesDB.listRows(DATABASE_ID, TABLE_ID, queries);

		return json({
			success: true,
			sessions: result.rows || []
		});
	} catch (error) {
		console.error('Failed to fetch tracking sessions:', error);
		return json({ error: 'Failed to fetch tracking sessions' }, { status: 500 });
	}
}
