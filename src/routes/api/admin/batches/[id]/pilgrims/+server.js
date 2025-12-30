import { json } from '@sveltejs/kit';
import { tablesDB, Query } from '$lib/server/appwrite.js';

const DATABASE_ID = 'hijrah';

/**
 * GET /api/admin/batches/[id]/pilgrims
 * Get all pilgrims assigned to a batch
 */
export async function GET({ params, url }) {
	try {
		const { id } = params;
		const limit = Math.min(parseInt(url.searchParams.get('limit') || '50'), 100);
		const offset = parseInt(url.searchParams.get('offset') || '0');

		// Get applications for this batch
		const applicationsResult = await tablesDB.listRows(DATABASE_ID, 'applications', [
			Query.equal('batchId', id),
			Query.limit(limit),
			Query.offset(offset)
		]);

		const applications = applicationsResult.rows || [];

		// Get lead pilgrims for each application
		const pilgrimsWithDetails = await Promise.all(
			applications.map(async (app) => {
				try {
					// Get lead pilgrim for this application
					const pilgrimsResult = await tablesDB.listRows(DATABASE_ID, 'pilgrims', [
						Query.equal('applicationId', app.$id),
						Query.equal('isLead', true),
						Query.limit(1)
					]);

					const leadPilgrim = pilgrimsResult.rows?.[0] || null;

					// Get total pilgrim count for this application
					const allPilgrimsResult = await tablesDB.listRows(DATABASE_ID, 'pilgrims', [
						Query.equal('applicationId', app.$id)
					]);

					return {
						applicationId: app.$id,
						applicationStatus: app.status,
						leadPilgrim,
						pilgrimCount: allPilgrimsResult.total || 0
					};
				} catch {
					return {
						applicationId: app.$id,
						applicationStatus: app.status,
						leadPilgrim: null,
						pilgrimCount: 0
					};
				}
			})
		);

		return json({
			success: true,
			pilgrims: pilgrimsWithDetails,
			total: applicationsResult.total || 0,
			limit,
			offset
		});
	} catch (error) {
		console.error('Failed to fetch batch pilgrims:', error);
		return json(
			{ error: 'Failed to fetch batch pilgrims', details: error.message },
			{ status: 500 }
		);
	}
}
