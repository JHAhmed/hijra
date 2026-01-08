import { json } from '@sveltejs/kit';
import { tablesDB, Query } from '$lib/server/appwrite.js';

const DATABASE_ID = 'hijrah';

/**
 * POST /api/admin/batches/[id]/assign
 * Assign pilgrims to a batch (by applicationId)
 */
export async function POST({ params, request }) {
	try {
		const { id } = params;
		const { applicationIds } = await request.json();

		if (!applicationIds || !Array.isArray(applicationIds) || applicationIds.length === 0) {
			return json({ error: 'applicationIds array is required' }, { status: 400 });
		}

		// Verify batch exists
		const batch = await tablesDB.getRow(DATABASE_ID, 'batches', id);
		if (!batch) {
			return json({ error: 'Batch not found' }, { status: 404 });
		}

		// Update each application with the batch ID
		const results = await Promise.all(
			applicationIds.map(async (appId) => {
				try {
					await tablesDB.updateRow(DATABASE_ID, 'applications', appId, {
						batchId: id
					});
					return { applicationId: appId, success: true };
				} catch (err) {
					return { applicationId: appId, success: false, error: err.message };
				}
			})
		);

		const successful = results.filter(r => r.success).length;
		const failed = results.filter(r => !r.success).length;

		return json({
			success: true,
			message: `Assigned ${successful} pilgrim(s) to batch${failed > 0 ? `, ${failed} failed` : ''}`,
			results
		});
	} catch (error) {
		console.error('Failed to assign pilgrims to batch:', error);
		return json({ error: 'Failed to assign pilgrims', details: error.message }, { status: 500 });
	}
}

/**
 * DELETE /api/admin/batches/[id]/assign
 * Remove pilgrims from a batch (by applicationId)
 */
export async function DELETE({ params, request }) {
	try {
		const { id } = params;
		const { applicationIds } = await request.json();

		if (!applicationIds || !Array.isArray(applicationIds) || applicationIds.length === 0) {
			return json({ error: 'applicationIds array is required' }, { status: 400 });
		}

		// Update each application to remove batch ID
		const results = await Promise.all(
			applicationIds.map(async (appId) => {
				try {
					// Verify the application belongs to this batch before removing
					const app = await tablesDB.getRow(DATABASE_ID, 'applications', appId);
					if (app.batchId !== id) {
						return { applicationId: appId, success: false, error: 'Application not in this batch' };
					}
					
					await tablesDB.updateRow(DATABASE_ID, 'applications', appId, {
						batchId: null
					});
					return { applicationId: appId, success: true };
				} catch (err) {
					return { applicationId: appId, success: false, error: err.message };
				}
			})
		);

		const successful = results.filter(r => r.success).length;
		const failed = results.filter(r => !r.success).length;

		return json({
			success: true,
			message: `Removed ${successful} pilgrim(s) from batch${failed > 0 ? `, ${failed} failed` : ''}`,
			results
		});
	} catch (error) {
		console.error('Failed to remove pilgrims from batch:', error);
		return json({ error: 'Failed to remove pilgrims', details: error.message }, { status: 500 });
	}
}

/**
 * GET /api/admin/batches/[id]/assign
 * Get unassigned applications (for adding to batch)
 */
export async function GET({ url }) {
	try {
		const month = url.searchParams.get('month'); // Format: YYYY-MM
		const limit = Math.min(parseInt(url.searchParams.get('limit') || '50'), 100);

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
