import { json } from '@sveltejs/kit';
import { tablesDB, Query } from '$lib/server/appwrite.js';

const DATABASE_ID = 'hijrah';

/**
 * GET /api/user/pilgrim-documents?applicationId=xxx
 * Fetch admin-uploaded documents for all pilgrims in this application
 */
export async function GET({ url }) {
	try {
		const applicationId = url.searchParams.get('applicationId');

		if (!applicationId) {
			return json({ error: 'applicationId is required' }, { status: 400 });
		}

		// Query documents table for admin-uploaded docs in this application
		const result = await tablesDB.listRows(DATABASE_ID, 'documents', [
			Query.equal('applicationId', applicationId),
			Query.equal('source', 'admin'),
			Query.orderDesc('$createdAt')
		]);

		return json({ success: true, documents: result.rows || [] });
	} catch (error) {
		console.error('Failed to fetch pilgrim documents:', error);
		return json({ error: 'Failed to fetch documents' }, { status: 500 });
	}
}
