import { json } from '@sveltejs/kit';
import { tablesDB, Query } from '$lib/server/appwrite.js';

const DATABASE_ID = 'hijrah';

/**
 * GET /api/admin/pilgrims
 * Fetch all pilgrims with optional filters
 *
 * Query params:
 * - limit: number of pilgrims to fetch (default: 25, max: 100)
 * - offset: pagination offset (default: 0)
 * - search: search by name
 * - applicationId: filter by application
 * - isLead: filter by lead status ('true' or 'false')
 */
export async function GET({ url }) {
	try {
		const limit = Math.min(parseInt(url.searchParams.get('limit') || '25'), 100);
		const offset = parseInt(url.searchParams.get('offset') || '0');
		const search = url.searchParams.get('search');
		const applicationId = url.searchParams.get('applicationId');
		const isLead = url.searchParams.get('isLead');

		// Build query
		const queries = [Query.orderDesc('$createdAt'), Query.limit(limit), Query.offset(offset)];

		// Filter by applicationId
		if (applicationId) {
			queries.push(Query.equal('applicationId', applicationId));
		}

		// Filter by isLead
		if (isLead === 'true') {
			queries.push(Query.equal('isLead', true));
		} else if (isLead === 'false') {
			queries.push(Query.equal('isLead', false));
		}

		const result = await tablesDB.listRows(DATABASE_ID, 'pilgrims', queries);

		let pilgrims = result.rows || [];
		const total = result.total || 0;

		// Client-side search filter (Appwrite doesn't support LIKE queries well)
		if (search) {
			const searchLower = search.toLowerCase();
			pilgrims = pilgrims.filter(
				(p) =>
					p.firstName?.toLowerCase().includes(searchLower) ||
					p.lastName?.toLowerCase().includes(searchLower) ||
					p.email?.toLowerCase().includes(searchLower)
			);
		}

		// Enrich with application status
		const enrichedPilgrims = await Promise.all(
			pilgrims.map(async (pilgrim) => {
				try {
					if (pilgrim.applicationId) {
						const application = await tablesDB.getRow(
							DATABASE_ID,
							'applications',
							pilgrim.applicationId
						);
						return {
							...pilgrim,
							application: {
								$id: application.$id,
								status: application.status,
								packageId: application.packageId
							}
						};
					}
					return { ...pilgrim, application: null };
				} catch {
					return { ...pilgrim, application: null };
				}
			})
		);

		return json({
			success: true,
			pilgrims: enrichedPilgrims,
			total,
			limit,
			offset
		});
	} catch (error) {
		console.error('Failed to fetch pilgrims:', error);
		return json({ error: 'Failed to fetch pilgrims', details: error.message }, { status: 500 });
	}
}
