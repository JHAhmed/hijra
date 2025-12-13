import { json } from '@sveltejs/kit';
import { tablesDB, ID } from '$lib/server/appwrite.js';

const DATABASE_ID = 'hijrah';

/**
 * POST /api/applications
 * Create a new application when user selects a package
 */
export async function POST({ request }) {
	try {
		const { userId, packageId } = await request.json();

		if (!userId || !packageId) {
			return json({ error: 'Missing required fields: userId, packageId' }, { status: 400 });
		}

		const application = await tablesDB.createRow(DATABASE_ID, 'applications', ID.unique(), {
			userId,
			packageId,
			status: 'package_selected',
			currentStep: 1,
			pilgrimCount: 1
		});

		return json({
			success: true,
			applicationId: application.$id
		});
	} catch (error) {
		console.error('Failed to create application:', error);
		return json({ error: 'Failed to create application', details: error.message }, { status: 500 });
	}
}
