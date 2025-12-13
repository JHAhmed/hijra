import { json } from '@sveltejs/kit';
import { tablesDB } from '$lib/server/appwrite.js';

const DATABASE_ID = 'hijrah';

/**
 * PUT /api/applications/[id]
 * Update an application's status and progress
 */
export async function PUT({ params, request }) {
	try {
		const { id } = params;
		const data = await request.json();

		if (!id) {
			return json({ error: 'Application ID is required' }, { status: 400 });
		}

		// Only allow certain fields to be updated
		const allowedFields = ['status', 'currentStep', 'pilgrimCount', 'totalAmount', 'notes'];
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

		return json({ success: true });
	} catch (error) {
		console.error('Failed to update application:', error);
		return json({ error: 'Failed to update application', details: error.message }, { status: 500 });
	}
}

/**
 * GET /api/applications/[id]
 * Get application details
 */
export async function GET({ params }) {
	try {
		const { id } = params;

		if (!id) {
			return json({ error: 'Application ID is required' }, { status: 400 });
		}

		const application = await tablesDB.getRow(DATABASE_ID, 'applications', id);

		return json({ success: true, application });
	} catch (error) {
		console.error('Failed to get application:', error);
		return json({ error: 'Failed to get application', details: error.message }, { status: 500 });
	}
}
