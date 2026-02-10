import { json } from '@sveltejs/kit';
import { tablesDB, storage, ID, Query } from '$lib/server/appwrite.js';
import { PUBLIC_APPWRITE_BUCKET_ID } from '$env/static/public';

const DATABASE_ID = 'hijrah';
const BUCKET_ID = PUBLIC_APPWRITE_BUCKET_ID || 'pilgrim-documents';

/**
 * GET /api/admin/pilgrims/[id]/documents
 * Fetch admin-uploaded documents for a pilgrim from the documents table
 */
export async function GET({ params }) {
	try {
		const { id } = params;

		const result = await tablesDB.listRows(DATABASE_ID, 'documents', [
			Query.equal('pilgrimId', id),
			Query.equal('source', 'admin'),
			Query.orderDesc('$createdAt')
		]);

		return json({ success: true, documents: result.rows || [] });
	} catch (error) {
		console.error('Failed to fetch pilgrim documents:', error);
		return json({ error: 'Failed to fetch documents' }, { status: 500 });
	}
}

/**
 * POST /api/admin/pilgrims/[id]/documents
 * Upload a document for a pilgrim (admin action) — stores in documents table
 */
export async function POST({ params, request }) {
	try {
		const { id } = params;
		const formData = await request.formData();
		const file = formData.get('file');
		// const label = formData.get('label') || file.name;

		if (!file) {
			return json({ error: 'No file provided' }, { status: 400 });
		}

		// Get pilgrim to find applicationId
		const pilgrim = await tablesDB.getRow(DATABASE_ID, 'pilgrims', id);

		// Upload file to Appwrite storage
		const uploadedFile = await storage.createFile(BUCKET_ID, ID.unique(), file);

		// Create document row in documents table
		const document = await tablesDB.createRow(DATABASE_ID, 'documents', ID.unique(), {
			pilgrimId: id,
			applicationId: pilgrim.applicationId || '',
			// type: label,
			fileId: uploadedFile.$id,
			fileName: file.name,
			status: 'approved',
			source: 'admin'
		});

		return json({ success: true, document });
	} catch (error) {
		console.error('Failed to upload document:', error);
		return json({ error: 'Failed to upload document', details: error.message }, { status: 500 });
	}
}

/**
 * DELETE /api/admin/pilgrims/[id]/documents
 * Delete a specific admin-uploaded document by its document row ID
 */
export async function DELETE({ params, request }) {
	try {
		const { id } = params;
		const { documentId } = await request.json();

		if (!documentId) {
			return json({ error: 'documentId is required' }, { status: 400 });
		}

		// Get the document row to find fileId
		const doc = await tablesDB.getRow(DATABASE_ID, 'documents', documentId);

		// Delete file from storage
		try {
			await storage.deleteFile(BUCKET_ID, doc.fileId);
		} catch (e) {
			console.warn('File may already be deleted from storage:', e.message);
		}

		// Delete the document row
		await tablesDB.deleteRow(DATABASE_ID, 'documents', documentId);

		return json({ success: true });
	} catch (error) {
		console.error('Failed to delete document:', error);
		return json({ error: 'Failed to delete document', details: error.message }, { status: 500 });
	}
}
