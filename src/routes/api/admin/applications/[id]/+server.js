import { json } from '@sveltejs/kit';
import { tablesDB, Query } from '$lib/server/appwrite.js';

const DATABASE_ID = 'hijrah';

/**
 * GET /api/admin/applications/[id]
 * Fetch a single application with all related data (pilgrims, documents)
 */
export async function GET({ params }) {
	try {
		const { id } = params;

		if (!id) {
			return json({ error: 'Application ID is required' }, { status: 400 });
		}

		// Fetch the application
		const application = await tablesDB.getRow(DATABASE_ID, 'applications', id);

		// Fetch all pilgrims for this application
		const pilgrimsResult = await tablesDB.listRows(DATABASE_ID, 'pilgrims', [
			Query.equal('applicationId', id)
		]);
		const pilgrims = pilgrimsResult.rows || [];

		// Separate lead pilgrim from family members
		const leadPilgrim = pilgrims.find((p) => p.isLead === true) || null;
		const familyMembers = pilgrims.filter((p) => p.isLead !== true);

		// Fetch all documents for this application
		let documents = [];
		try {
			const documentsResult = await tablesDB.listRows(DATABASE_ID, 'documents', [
				Query.equal('applicationId', id)
			]);
			documents = documentsResult.rows || [];
		} catch {
			// Documents collection might not exist yet
			console.log('No documents found or collection does not exist');
		}

		// Fetch package details if packageId exists
		let packageDetails = null;
		if (application.packageId) {
			try {
				packageDetails = await tablesDB.getRow(DATABASE_ID, 'packages', application.packageId);
			} catch {
				console.log('Package not found');
			}
		}

		return json({
			success: true,
			application,
			leadPilgrim,
			familyMembers,
			documents,
			package: packageDetails
		});
	} catch (error) {
		console.error('Failed to fetch application:', error);
		return json({ error: 'Failed to fetch application', details: error.message }, { status: 500 });
	}
}

/**
 * PUT /api/admin/applications/[id]
 * Update an application (admin has more fields available)
 */
export async function PUT({ params, request }) {
	try {
		const { id } = params;
		const data = await request.json();

		if (!id) {
			return json({ error: 'Application ID is required' }, { status: 400 });
		}

		// Admin can update more fields than regular users
		const allowedFields = [
			'status',
			'currentStep',
			'pilgrimCount',
			'totalAmount',
			'notes',
			'adminNotes',
			'priority',
			'assignedTo'
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

		await tablesDB.updateRow(DATABASE_ID, 'applications', id, updateData);

		// Fetch updated application
		const application = await tablesDB.getRow(DATABASE_ID, 'applications', id);

		return json({ success: true, application });
	} catch (error) {
		console.error('Failed to update application:', error);
		return json({ error: 'Failed to update application', details: error.message }, { status: 500 });
	}
}

/**
 * DELETE /api/admin/applications/[id]
 * Delete an application and all related data
 */
export async function DELETE({ params }) {
	try {
		const { id } = params;

		if (!id) {
			return json({ error: 'Application ID is required' }, { status: 400 });
		}

		// Delete related pilgrims
		try {
			const pilgrimsResult = await tablesDB.listRows(DATABASE_ID, 'pilgrims', [
				Query.equal('applicationId', id)
			]);
			for (const pilgrim of pilgrimsResult.rows || []) {
				await tablesDB.deleteRow(DATABASE_ID, 'pilgrims', pilgrim.$id);
			}
		} catch {
			console.log('No pilgrims to delete or error deleting');
		}

		// Delete related documents
		try {
			const documentsResult = await tablesDB.listRows(DATABASE_ID, 'documents', [
				Query.equal('applicationId', id)
			]);
			for (const doc of documentsResult.rows || []) {
				await tablesDB.deleteRow(DATABASE_ID, 'documents', doc.$id);
			}
		} catch {
			console.log('No documents to delete or error deleting');
		}

		// Delete the application
		await tablesDB.deleteRow(DATABASE_ID, 'applications', id);

		return json({ success: true });
	} catch (error) {
		console.error('Failed to delete application:', error);
		return json({ error: 'Failed to delete application', details: error.message }, { status: 500 });
	}
}
