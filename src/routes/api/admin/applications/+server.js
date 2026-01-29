import { json } from '@sveltejs/kit';
import { tablesDB, Query } from '$lib/server/appwrite.js';

const DATABASE_ID = 'hijrah';

/**
 * GET /api/admin/applications
 * Fetch all applications with optional filters
 *
 * Query params:
 * - limit: number of applications to fetch (default: 25, max: 100)
 * - offset: pagination offset (default: 0)
 * - status: filter by status
 * - recent: if 'true', returns last 5 applications ordered by creation date
 */
export async function GET({ url }) {
	try {
		const limit = Math.min(parseInt(url.searchParams.get('limit') || '25'), 100);
		const offset = parseInt(url.searchParams.get('offset') || '0');
		const status = url.searchParams.get('status');
		const recent = url.searchParams.get('recent') === 'true';

		// Build query
		const queries = [];

		// If fetching recent applications for dashboard
		if (recent) {
			queries.push(Query.orderDesc('$createdAt'));
			queries.push(Query.limit(5));
		} else {
			// Standard pagination
			queries.push(Query.orderDesc('$createdAt'));
			queries.push(Query.limit(limit));
			queries.push(Query.offset(offset));

			// Optional status filter
			if (status) {
				queries.push(Query.equal('status', status));
			}
		}

		const result = await tablesDB.listRows(DATABASE_ID, 'applications', queries);

		const applications = result.rows || [];
		const total = result.total || 0;

		// For recent applications, also fetch the lead pilgrim info for each
		if (recent && applications.length > 0) {
			const enrichedApplications = await Promise.all(
				applications.map(async (app) => {
					try {
						// Fetch lead pilgrim for this application
						const pilgrimsResult = await tablesDB.listRows(DATABASE_ID, 'pilgrims', [
							Query.equal('applicationId', app.$id),
							Query.equal('isLead', true),
							Query.limit(1)
						]);

						const leadPilgrim = pilgrimsResult.rows?.[0] || null;

						// console.log('Lead Pilgrim:', leadPilgrim);
						// console.log('Application:', app);

						return {
							...app,
							leadPilgrim: leadPilgrim
								? {
										firstName: leadPilgrim.firstName,
										lastName: leadPilgrim.lastName,
										applicationId: leadPilgrim.applicationId,
										isLead: leadPilgrim.isLead,
										$id: leadPilgrim.$id
									}
								: null
						};
					} catch {
						return { ...app, leadPilgrim: null };
					}
				})
			);

			return json({
				success: true,
				applications: enrichedApplications,
				total
			});
		}

		return json({
			success: true,
			applications,
			total,
			limit,
			offset
		});
	} catch (error) {
		console.error('Failed to fetch applications:', error);
		return json({ error: 'Failed to fetch applications', details: error.message }, { status: 500 });
	}
}
