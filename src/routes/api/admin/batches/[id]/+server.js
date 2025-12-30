import { json } from '@sveltejs/kit';
import { tablesDB, Query } from '$lib/server/appwrite.js';

const DATABASE_ID = 'hijrah';

/**
 * GET /api/admin/batches/[id]
 * Get batch details with pilgrim count
 */
export async function GET({ params }) {
	try {
		const { id } = params;

		const batch = await tablesDB.getRow(DATABASE_ID, 'batches', id);

		if (!batch) {
			return json({ error: 'Batch not found' }, { status: 404 });
		}

		// Get pilgrim count for this batch
		const applicationsResult = await tablesDB.listRows(DATABASE_ID, 'applications', [
			Query.equal('batchId', id)
		]);

		return json({
			success: true,
			batch: {
				...batch,
				pilgrimCount: applicationsResult.total || 0
			}
		});
	} catch (error) {
		console.error('Failed to fetch batch:', error);
		return json({ error: 'Failed to fetch batch', details: error.message }, { status: 500 });
	}
}

/**
 * PUT /api/admin/batches/[id]
 * Update batch details
 */
export async function PUT({ params, request }) {
	try {
		const { id } = params;
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

		// Build update object with only provided fields
		const updateData = {};
		if (name !== undefined) updateData.name = name;
		if (startDate !== undefined) updateData.startDate = startDate;
		if (endDate !== undefined) updateData.endDate = endDate;
		if (guideId !== undefined) updateData.guideId = guideId;
		if (guideName !== undefined) updateData.guideName = guideName;
		if (guidePhone !== undefined) updateData.guidePhone = guidePhone;
		if (meetingPoint !== undefined) updateData.meetingPoint = meetingPoint;
		if (meetingPointAddress !== undefined) updateData.meetingPointAddress = meetingPointAddress;
		if (maxCapacity !== undefined) updateData.maxCapacity = maxCapacity;
		if (status !== undefined) updateData.status = status;
		if (notes !== undefined) updateData.notes = notes;
		if (packageId !== undefined) updateData.packageId = packageId;

		const batch = await tablesDB.updateRow(DATABASE_ID, 'batches', id, updateData);

		return json({
			success: true,
			batch
		});
	} catch (error) {
		console.error('Failed to update batch:', error);
		return json({ error: 'Failed to update batch', details: error.message }, { status: 500 });
	}
}

/**
 * DELETE /api/admin/batches/[id]
 * Delete batch (only if no pilgrims assigned)
 */
export async function DELETE({ params }) {
	try {
		const { id } = params;

		// Check if batch has assigned pilgrims
		const applicationsResult = await tablesDB.listRows(DATABASE_ID, 'applications', [
			Query.equal('batchId', id),
			Query.limit(1)
		]);

		if (applicationsResult.total > 0) {
			return json(
				{
					error: 'Cannot delete batch with assigned pilgrims',
					pilgrimCount: applicationsResult.total
				},
				{ status: 400 }
			);
		}

		await tablesDB.deleteRow(DATABASE_ID, 'batches', id);

		return json({
			success: true,
			message: 'Batch deleted successfully'
		});
	} catch (error) {
		console.error('Failed to delete batch:', error);
		return json({ error: 'Failed to delete batch', details: error.message }, { status: 500 });
	}
}
