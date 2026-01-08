import { json } from '@sveltejs/kit';
import { tablesDB, Query } from '$lib/server/appwrite.js';

const DATABASE_ID = 'hijrah';

/**
 * GET /api/admin/batches/temp/assign
 * Get unassigned applications matching a preferred month (for batch creation preview)
 */
export async function GET({ url }) {
	try {
		const month = url.searchParams.get('month'); // Format: YYYY-MM
		const limit = Math.min(parseInt(url.searchParams.get('limit') || '100'), 200);

		const queries = [
			Query.isNull('batchId'),
			Query.limit(limit),
			Query.orderDesc('$createdAt')
		];

		// Filter by preferred departure month if provided
		if (month) {
			const startOfMonth = new Date(`${month}-01T00:00:00.000Z`);
			const endOfMonth = new Date(startOfMonth);
			endOfMonth.setMonth(endOfMonth.getMonth() + 1);

			queries.push(Query.greaterThanEqual('preferredDepartureDate', startOfMonth.toISOString()));
			queries.push(Query.lessThan('preferredDepartureDate', endOfMonth.toISOString()));
		}

		const result = await tablesDB.listRows(DATABASE_ID, 'applications', queries);
		const applications = result.rows || [];

		// Enrich with lead pilgrim info
		const enrichedApplications = await Promise.all(
			applications.map(async (app) => {
				try {
					const pilgrimsResult = await tablesDB.listRows(DATABASE_ID, 'pilgrims', [
						Query.equal('applicationId', app.$id),
						Query.equal('isLead', true),
						Query.limit(1)
					]);
					const leadPilgrim = pilgrimsResult.rows?.[0] || null;
					return { ...app, leadPilgrim };
				} catch {
					return { ...app, leadPilgrim: null };
				}
			})
		);

		return json({
			success: true,
			applications: enrichedApplications,
			total: result.total || 0
		});
	} catch (error) {
		console.error('Failed to fetch unassigned applications:', error);
		return json({ error: 'Failed to fetch applications', details: error.message }, { status: 500 });
	}
}
