import { json } from '@sveltejs/kit';
import { tablesDB, Query } from '$lib/server/appwrite.js';

const DATABASE_ID = 'hijrah';

/**
 * GET /api/admin/pilgrims/[id]
 * Fetch a single pilgrim with all related data
 */
export async function GET({ params }) {
	try {
		const { id } = params;

		if (!id) {
			return json({ error: 'Pilgrim ID is required' }, { status: 400 });
		}

		// Fetch the pilgrim
		const pilgrim = await tablesDB.getRow(DATABASE_ID, 'pilgrims', id);

		// Fetch linked application
		let application = null;
		if (pilgrim.applicationId) {
			try {
				application = await tablesDB.getRow(DATABASE_ID, 'applications', pilgrim.applicationId);
			} catch {
				console.log('Application not found');
			}
		}

		// Fetch documents for this pilgrim
		let documents = [];
		try {
			const documentsResult = await tablesDB.listRows(DATABASE_ID, 'documents', [
				Query.equal('pilgrimId', id)
			]);
			documents = documentsResult.rows || [];
		} catch {
			console.log('No documents found or collection does not exist');
		}

		// Fetch package details if application has packageId
		let packageDetails = null;
		if (application?.packageId) {
			try {
				packageDetails = await tablesDB.getRow(DATABASE_ID, 'packages', application.packageId);
			} catch {
				console.log('Package not found');
			}
		}

		return json({
			success: true,
			pilgrim,
			application,
			documents,
			package: packageDetails
		});
	} catch (error) {
		console.error('Failed to fetch pilgrim:', error);
		return json({ error: 'Failed to fetch pilgrim', details: error.message }, { status: 500 });
	}
}

/**
 * PUT /api/admin/pilgrims/[id]
 * Update a pilgrim's details
 */
export async function PUT({ params, request }) {
	try {
		const { id } = params;
		const data = await request.json();

		if (!id) {
			return json({ error: 'Pilgrim ID is required' }, { status: 400 });
		}

		// Allowed fields for update
		const allowedFields = [
			'firstName',
			'lastName',
			'email',
			'phone',
			'gender',
			'passportNumber',
			'passportExpiry',
			'relation'
		];
		const updateData = {};

		for (const field of allowedFields) {
			if (data[field] !== undefined) {
				updateData[field] = data[field];
			}
		}

		if (Object.keys(updateData).length === 0) {
			return json({ error: 'No valid fields to update' }, { status: 400 });
		}

		await tablesDB.updateRow(DATABASE_ID, 'pilgrims', id, updateData);

		// Fetch updated pilgrim
		const pilgrim = await tablesDB.getRow(DATABASE_ID, 'pilgrims', id);

		return json({ success: true, pilgrim });
	} catch (error) {
		console.error('Failed to update pilgrim:', error);
		return json({ error: 'Failed to update pilgrim', details: error.message }, { status: 500 });
	}
}

/**
 * DELETE /api/admin/pilgrims/[id]
 * Delete a pilgrim and their documents
 */
export async function DELETE({ params }) {
	try {
		const { id } = params;

		if (!id) {
			return json({ error: 'Pilgrim ID is required' }, { status: 400 });
		}

		// Delete related documents
		try {
			const documentsResult = await tablesDB.listRows(DATABASE_ID, 'documents', [
				Query.equal('pilgrimId', id)
			]);
			for (const doc of documentsResult.rows || []) {
				await tablesDB.deleteRow(DATABASE_ID, 'documents', doc.$id);
			}
		} catch {
			console.log('No documents to delete or error deleting');
		}

		// Delete the pilgrim
		await tablesDB.deleteRow(DATABASE_ID, 'pilgrims', id);

		return json({ success: true });
	} catch (error) {
		console.error('Failed to delete pilgrim:', error);
		return json({ error: 'Failed to delete pilgrim', details: error.message }, { status: 500 });
	}
}
