import { json } from '@sveltejs/kit';
import { tablesDB } from '$lib/server/appwrite.js';

const DATABASE_ID = 'hijrah';

/**
 * PUT /api/admin/documents/[id]/approve
 * Approve or reject a document
 */
export async function PUT({ params, request }) {
	try {
		const { id } = params;
		const { status, applicationId } = await request.json();

		if (!id) {
			return json({ error: 'Document ID is required' }, { status: 400 });
		}

		if (!status || !['approved', 'rejected', 'pending'].includes(status)) {
			return json({ error: 'Valid status required (approved/rejected/pending)' }, { status: 400 });
		}

		// Update document status
		await tablesDB.updateRow(DATABASE_ID, 'documents', id, {
			status
			// reviewedAt: new Date().toISOString()
		});

		// If approving, check if all documents for this application are approved
		if (status === 'approved' && applicationId) {
			try {
				const documents = await tablesDB.listRows(DATABASE_ID, 'documents', [
					tablesDB.Query.equal('applicationId', applicationId)
				]);

				const allApproved = documents.rows.every((doc) => doc.status === 'approved');

				// If all documents are approved, update application status
				if (allApproved) {
					await tablesDB.updateRow(DATABASE_ID, 'applications', applicationId, {
						status: 'docs_approved'
					});
				}
			} catch (error) {
				console.error('Error checking document approval status:', error);
			}
		}

		return json({ success: true });
	} catch (error) {
		console.error('Failed to update document:', error);
		return json({ error: 'Failed to update document', details: error.message }, { status: 500 });
	}
}
