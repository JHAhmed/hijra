import { json } from '@sveltejs/kit';
import { tablesDB, ID, Query } from '$lib/server/appwrite.js';

const DATABASE_ID = 'hijrah';

/**
 * GET /api/admin/batches
 * Fetch all batches with optional filters
 *
 * Query params:
 * - limit: number of batches to fetch (default: 25, max: 100)
 * - offset: pagination offset (default: 0)
 * - status: filter by status
 * - month: filter by month (format: YYYY-MM)
 */
export async function GET({ url }) {
	try {
		const limit = Math.min(parseInt(url.searchParams.get('limit') || '25'), 100);
		const offset = parseInt(url.searchParams.get('offset') || '0');
		const status = url.searchParams.get('status');
		const month = url.searchParams.get('month');

		// Build query
		const queries = [Query.orderDesc('startDate'), Query.limit(limit), Query.offset(offset)];

		// Filter by status
		if (status) {
			queries.push(Query.equal('status', status));
		}

		// Filter by month (startDate within month)
		if (month) {
			const startOfMonth = new Date(`${month}-01T00:00:00.000Z`);
			const endOfMonth = new Date(startOfMonth);
			endOfMonth.setMonth(endOfMonth.getMonth() + 1);

			queries.push(Query.greaterThanEqual('startDate', startOfMonth.toISOString()));
			queries.push(Query.lessThan('startDate', endOfMonth.toISOString()));
		}

		const result = await tablesDB.listRows(DATABASE_ID, 'batches', queries);

		const batches = result.rows || [];
		const total = result.total || 0;

		// Enrich with pilgrim count
		const enrichedBatches = await Promise.all(
			batches.map(async (batch) => {
				try {
					const pilgrimsResult = await tablesDB.listRows(DATABASE_ID, 'applications', [
						Query.equal('batchId', batch.$id),
						Query.limit(1)
					]);
					return {
						...batch,
						pilgrimCount: pilgrimsResult.total || 0
					};
				} catch {
					return { ...batch, pilgrimCount: 0 };
				}
			})
		);

		return json({
			success: true,
			batches: enrichedBatches,
			total,
			limit,
			offset
		});
	} catch (error) {
		console.error('Failed to fetch batches:', error);
		return json({ error: 'Failed to fetch batches', details: error.message }, { status: 500 });
	}
}

/**
 * POST /api/admin/batches
 * Create a new batch
 */
export async function POST({ request }) {
	try {
		const data = await request.json();

		const {
			name,
			startDate,
			endDate,
			guideId,
			guideName,
			guidePhone,
			meetingPoint,
			meetingPointAddress,
			maxCapacity,
			status,
			notes,
			packageId
		} = data;

		if (!name || !startDate || !endDate) {
			return json({ error: 'Name, startDate, and endDate are required' }, { status: 400 });
		}

		const batch = await tablesDB.createRow(DATABASE_ID, 'batches', ID.unique(), {
			name,
			startDate,
			endDate,
			guideId: guideId || null,
			guideName: guideName || null,
			guidePhone: guidePhone || null,
			meetingPoint: meetingPoint || null,
			meetingPointAddress: meetingPointAddress || null,
			maxCapacity: maxCapacity || 50,
			status: status || 'draft',
			notes: notes || null,
			packageId: packageId || null
		});

		return json({
			success: true,
			batch
		});
	} catch (error) {
		console.error('Failed to create batch:', error);
		return json({ error: 'Failed to create batch', details: error.message }, { status: 500 });
	}
}
