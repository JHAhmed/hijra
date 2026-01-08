import { json } from '@sveltejs/kit';
import { tablesDB, Query } from '$lib/server/appwrite.js';

const DATABASE_ID = 'hijrah';

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
 * GET /api/admin/batches/[id]/tracking
 * Get batch tracking data
 */
export async function GET({ params }) {
	try {
		const { id } = params;

		const batch = await tablesDB.getRow(DATABASE_ID, 'batches', id);

		if (!batch) {
			return json({ error: 'Batch not found' }, { status: 404 });
		}

		return json({
			success: true,
			trackingCode: batch.trackingCode || null,
			trackingActive: batch.trackingActive || false,
			latitude: batch.latitude || null,
			longitude: batch.longitude || null,
			currentActivity: batch.currentActivity || null,
			lastUpdated: batch.lastUpdated || null,
			batchName: batch.name
		});
	} catch (error) {
		console.error('Failed to fetch batch tracking:', error);
		return json({ error: 'Failed to fetch batch tracking', details: error.message }, { status: 500 });
	}
}

/**
 * POST /api/admin/batches/[id]/tracking
 * Generate or regenerate tracking code for batch
 */
export async function POST({ params }) {
	try {
		const { id } = params;

		// Generate unique tracking code
		let trackingCode = generateTrackingCode();
		let attempts = 0;
		const maxAttempts = 5;

		// Ensure code is unique across batches
		while (attempts < maxAttempts) {
			const existing = await tablesDB.listRows(DATABASE_ID, 'batches', [
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

		// Update batch with new tracking code
		await tablesDB.updateRow(DATABASE_ID, 'batches', id, {
			trackingCode,
			trackingActive: false
		});

		return json({
			success: true,
			trackingCode
		});
	} catch (error) {
		console.error('Failed to generate tracking code:', error);
		return json({ error: 'Failed to generate tracking code', details: error.message }, { status: 500 });
	}
}

/**
 * PUT /api/admin/batches/[id]/tracking
 * Update batch tracking data (location, activity, active status)
 */
export async function PUT({ params, request }) {
	try {
		const { id } = params;
		const body = await request.json();
		const { latitude, longitude, currentActivity, trackingActive } = body;

		// Build update object
		const updates = {
			lastUpdated: new Date().toISOString()
		};

		if (latitude !== undefined && longitude !== undefined) {
			updates.latitude = latitude;
			updates.longitude = longitude;
		}

		if (currentActivity !== undefined) {
			updates.currentActivity = currentActivity;
		}

		if (trackingActive !== undefined) {
			updates.trackingActive = trackingActive;
		}

		await tablesDB.updateRow(DATABASE_ID, 'batches', id, updates);

		return json({
			success: true,
			message: 'Batch tracking updated'
		});
	} catch (error) {
		console.error('Failed to update batch tracking:', error);
		return json({ error: 'Failed to update batch tracking', details: error.message }, { status: 500 });
	}
}
