import { json } from '@sveltejs/kit';
import { tablesDB, Query } from '$lib/server/appwrite.js';

const DATABASE_ID = 'hijrah';

/**
 * GET /api/tracking/[code]
 * Fetch tracking data by code (public endpoint for viewers)
 * Now uses batches table instead of pilgrim_tracking
 */
export async function GET({ params }) {
	try {
		const { code } = params;

		if (!code) {
			return json({ error: 'Tracking code is required' }, { status: 400 });
		}

		// Look up batch by tracking code
		const result = await tablesDB.listRows(DATABASE_ID, 'batches', [
			Query.equal('trackingCode', code.toUpperCase())
		]);

		if (!result.rows || result.rows.length === 0) {
			return json({ error: 'Tracking session not found' }, { status: 404 });
		}

		const batch = result.rows[0];

		// Check if tracking is inactive
		if (!batch.trackingActive) {
			return json({
				success: true,
				inactive: true,
				batchName: batch.name
			});
		}

		// Get package type by finding an application linked to this batch
		let packageType = null;
		try {
			const applications = await tablesDB.listRows(DATABASE_ID, 'applications', [
				Query.equal('batchId', batch.$id),
				Query.limit(1)
			]);

			if (applications.rows && applications.rows.length > 0 && applications.rows[0].packageId) {
				const pkg = await tablesDB.getRow(DATABASE_ID, 'packages', applications.rows[0].packageId);
				if (pkg && pkg.type) {
					packageType = pkg.type.toLowerCase();
				}
			}
		} catch (err) {
			console.warn('Failed to fetch package type:', err);
		}

		return json({
			success: true,
			batchName: batch.name,
			latitude: batch.latitude,
			longitude: batch.longitude,
			currentActivity: batch.currentActivity,
			lastUpdated: batch.lastUpdated,
			trackingActive: batch.trackingActive,
			packageType: packageType
		});
	} catch (error) {
		console.error('Failed to fetch tracking data:', error);
		return json({ error: 'Failed to fetch tracking data' }, { status: 500 });
	}
}

/**
 * PUT /api/tracking/[code]
 * Update location and/or activity (called by admin/guide device)
 */
export async function PUT({ params, request }) {
	try {
		const { code } = params;
		const body = await request.json();
		const { latitude, longitude, currentActivity, trackingActive } = body;

		if (!code) {
			return json({ error: 'Tracking code is required' }, { status: 400 });
		}

		// Find the batch by tracking code
		const result = await tablesDB.listRows(DATABASE_ID, 'batches', [
			Query.equal('trackingCode', code.toUpperCase())
		]);

		if (!result.rows || result.rows.length === 0) {
			return json({ error: 'Tracking session not found' }, { status: 404 });
		}

		const batch = result.rows[0];

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

		await tablesDB.updateRow(DATABASE_ID, 'batches', batch.$id, updates);

		return json({
			success: true,
			message: 'Tracking data updated'
		});
	} catch (error) {
		console.error('Failed to update tracking data:', error);
		return json({ error: 'Failed to update tracking data' }, { status: 500 });
	}
}

/**
 * DELETE /api/tracking/[code]
 * Stop tracking session (set inactive)
 */
export async function DELETE({ params }) {
	try {
		const { code } = params;

		if (!code) {
			return json({ error: 'Tracking code is required' }, { status: 400 });
		}

		const result = await tablesDB.listRows(DATABASE_ID, 'batches', [
			Query.equal('trackingCode', code.toUpperCase())
		]);

		if (!result.rows || result.rows.length === 0) {
			return json({ error: 'Tracking session not found' }, { status: 404 });
		}

		const batch = result.rows[0];

		// Mark as inactive
		await tablesDB.updateRow(DATABASE_ID, 'batches', batch.$id, {
			trackingActive: false
		});

		return json({
			success: true,
			message: 'Tracking session stopped'
		});
	} catch (error) {
		console.error('Failed to stop tracking session:', error);
		return json({ error: 'Failed to stop tracking session' }, { status: 500 });
	}
}
