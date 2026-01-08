import { json } from '@sveltejs/kit';
import { tablesDB, Query } from '$lib/server/appwrite.js';

const DATABASE_ID = 'hijrah';

/**
 * GET /api/user/batch-tracking
 * Get the user's batch tracking info based on their application
 */
export async function GET({ url }) {
	try {
		const userId = url.searchParams.get('userId');

		if (!userId) {
			return json({ error: 'User ID is required' }, { status: 400 });
		}

		// Get the user's most recent application with a batch assigned
		const applications = await tablesDB.listRows(DATABASE_ID, 'applications', [
			Query.equal('userId', userId),
			Query.orderDesc('$createdAt'),
			Query.limit(1)
		]);

		if (!applications.rows || applications.rows.length === 0) {
			return json({
				success: true,
				hasBatch: false,
				message: 'No application found'
			});
		}

		const application = applications.rows[0];

		if (!application.batchId) {
			return json({
				success: true,
				hasBatch: false,
				message: 'No batch assigned to your application yet'
			});
		}

		// Get the batch details including tracking info
		const batch = await tablesDB.getRow(DATABASE_ID, 'batches', application.batchId);

		if (!batch) {
			return json({
				success: true,
				hasBatch: false,
				message: 'Batch not found'
			});
		}

		return json({
			success: true,
			hasBatch: true,
			batchId: batch.$id,
			batchName: batch.name,
			trackingCode: batch.trackingCode || null,
			trackingActive: batch.trackingActive || false,
			latitude: batch.latitude || null,
			longitude: batch.longitude || null,
			currentActivity: batch.currentActivity || null,
			lastUpdated: batch.lastUpdated || null,
			startDate: batch.startDate,
			endDate: batch.endDate
		});
	} catch (error) {
		console.error('Failed to get user batch tracking:', error);
		return json({ error: 'Failed to get batch tracking', details: error.message }, { status: 500 });
	}
}
