import { json } from '@sveltejs/kit';
import { tablesDB, Query } from '$lib/server/appwrite.js';

const DATABASE_ID = 'hijrah';
const TABLE_ID = 'pilgrim_tracking';

/**
 * GET /api/tracking/[code]
 * Fetch tracking data by code (public endpoint for viewers)
 */
export async function GET({ params }) {
	try {
		const { code } = params;

		if (!code) {
			return json({ error: 'Tracking code is required' }, { status: 400 });
		}

		const result = await tablesDB.listRows(DATABASE_ID, TABLE_ID, [
			Query.equal('trackingCode', code.toUpperCase())
		]);

		if (!result.rows || result.rows.length === 0) {
			return json({ error: 'Tracking session not found' }, { status: 404 });
		}

		const session = result.rows[0];

		// Check if expired
		if (new Date(session.expiresAt) < new Date()) {
			return json({
				success: true,
				expired: true,
				pilgrimName: session.pilgrimName
			});
		}

		// Check if inactive
		if (!session.isActive) {
			return json({
				success: true,
				inactive: true,
				pilgrimName: session.pilgrimName
			});
		}

		return json({
			success: true,
			pilgrimName: session.pilgrimName,
			latitude: session.latitude,
			longitude: session.longitude,
			currentActivity: session.currentActivity,
			lastUpdated: session.lastUpdated,
			isActive: session.isActive
		});
	} catch (error) {
		console.error('Failed to fetch tracking data:', error);
		return json({ error: 'Failed to fetch tracking data' }, { status: 500 });
	}
}

/**
 * PUT /api/tracking/[code]
 * Update location and/or activity (called by pilgrim's device)
 */
export async function PUT({ params, request }) {
	try {
		const { code } = params;
		const body = await request.json();
		const { latitude, longitude, currentActivity, isActive } = body;

		if (!code) {
			return json({ error: 'Tracking code is required' }, { status: 400 });
		}

		// Find the session
		const result = await tablesDB.listRows(DATABASE_ID, TABLE_ID, [
			Query.equal('trackingCode', code.toUpperCase())
		]);

		if (!result.rows || result.rows.length === 0) {
			return json({ error: 'Tracking session not found' }, { status: 404 });
		}

		const session = result.rows[0];

		// Check if expired
		if (new Date(session.expiresAt) < new Date()) {
			return json({ error: 'Tracking session has expired' }, { status: 410 });
		}

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

		if (isActive !== undefined) {
			updates.isActive = isActive;
		}

		await tablesDB.updateRow(DATABASE_ID, TABLE_ID, session.$id, updates);

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
 * Stop/delete tracking session
 */
export async function DELETE({ params }) {
	try {
		const { code } = params;

		if (!code) {
			return json({ error: 'Tracking code is required' }, { status: 400 });
		}

		const result = await tablesDB.listRows(DATABASE_ID, TABLE_ID, [
			Query.equal('trackingCode', code.toUpperCase())
		]);

		if (!result.rows || result.rows.length === 0) {
			return json({ error: 'Tracking session not found' }, { status: 404 });
		}

		const session = result.rows[0];

		// Mark as inactive instead of deleting (for history)
		await tablesDB.updateRow(DATABASE_ID, TABLE_ID, session.$id, {
			isActive: false
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
