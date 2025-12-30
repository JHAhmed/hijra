import { json } from '@sveltejs/kit';
import { tablesDB, Query } from '$lib/server/appwrite.js';

const DATABASE_ID = 'hijrah';

/**
 * GET /api/batches
 * Get batch info for a pilgrim's application (public-facing)
 *
 * Query params:
 * - applicationId: the application ID to get batch for
 */
export async function GET({ url }) {
	try {
		const applicationId = url.searchParams.get('applicationId');

		if (!applicationId) {
			return json({ error: 'Application ID is required' }, { status: 400 });
		}

		// Get the application
		const application = await tablesDB.getRow(DATABASE_ID, 'applications', applicationId);

		if (!application) {
			return json({ error: 'Application not found' }, { status: 404 });
		}

		if (!application.batchId) {
			return json({
				success: true,
				batch: null,
				message: 'No batch assigned yet'
			});
		}

		// Get the batch
		const batch = await tablesDB.getRow(DATABASE_ID, 'batches', application.batchId);

		if (!batch) {
			return json({
				success: true,
				batch: null,
				message: 'Batch not found'
			});
		}

		// Return batch info (without sensitive admin data)
		return json({
			success: true,
			batch: {
				$id: batch.$id,
				name: batch.name,
				startDate: batch.startDate,
				endDate: batch.endDate,
				guideName: batch.guideName,
				guidePhone: batch.guidePhone,
				meetingPoint: batch.meetingPoint,
				meetingPointAddress: batch.meetingPointAddress,
				status: batch.status
			}
		});
	} catch (error) {
		console.error('Failed to fetch batch:', error);
		return json({ error: 'Failed to fetch batch', details: error.message }, { status: 500 });
	}
}
