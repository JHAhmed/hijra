import { json } from '@sveltejs/kit';
import { storage, tablesDB, ID, Permission, Role } from '$lib/server/appwrite.js';
import { env } from '$env/dynamic/public';

const DATABASE_ID = 'hijrah';
const BUCKET_ID = env.PUBLIC_APPWRITE_BUCKET_ID || 'pilgrim-documents';

/**
 * POST /api/documents
 * Upload a document for a pilgrim and save reference to database
 */
export async function POST({ request }) {
	try {
		const form = await request.formData();

		const file = form.get('file');
		const pilgrimId = form.get('pilgrimId');
		const applicationId = form.get('applicationId');
		const docType = form.get('docType');
		const userId = form.get('userId');

		if (!file || file.size === 0) {
			return json({ error: 'No file provided' }, { status: 400 });
		}

		if (!pilgrimId || !applicationId || !docType) {
			return json(
				{ error: 'Missing required fields: pilgrimId, applicationId, docType' },
				{ status: 400 }
			);
		}

		// Upload file to Appwrite Storage
		const uploadedFile = await storage.createFile(
			BUCKET_ID,
			ID.unique(),
			file,
			userId ? [Permission.read(Role.user(userId)), Permission.write(Role.user(userId))] : []
		);

		// Create document record in database
		const document = await tablesDB.createRow(DATABASE_ID, 'documents', ID.unique(), {
			pilgrimId,
			applicationId,
			type: docType,
			fileId: uploadedFile.$id,
			fileName: file.name,
			status: 'pending'
		});

		return json({
			success: true,
			fileId: uploadedFile.$id,
			documentId: document.$id
		});
	} catch (error) {
		console.error('Document upload failed:', error);
		return json({ error: 'Failed to upload document', details: error.message }, { status: 500 });
	}
}
