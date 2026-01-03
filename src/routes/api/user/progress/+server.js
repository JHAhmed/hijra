import { json } from '@sveltejs/kit';
import { tablesDB, Query } from '$lib/server/appwrite.js';

const DATABASE_ID = 'hijrah';

/**
 * GET /api/user/progress
 * Get the current user's application progress
 */
export async function GET({ url }) {
	try {
		const userId = url.searchParams.get('userId');

		if (!userId) {
			return json({ error: 'User ID is required' }, { status: 400 });
		}

		// Get the user's most recent application
		const applications = await tablesDB.listRows(DATABASE_ID, 'applications', [
			Query.equal('userId', userId),
			Query.orderDesc('$createdAt'),
			Query.limit(1)
		]);

		if (!applications.rows || applications.rows.length === 0) {
			// No application yet - user is at step 0
			return json({
				success: true,
				hasApplication: false,
				currentStep: 0,
				status: null,
				applicationId: null
			});
		}

		const application = applications.rows[0];

	// Fetch lead pilgrim's comments
	let pilgrimComments = null;
	try {
		const pilgrimsResult = await tablesDB.listRows(DATABASE_ID, 'pilgrims', [
			Query.equal('applicationId', application.$id),
			Query.equal('isLead', true),
			Query.limit(1)
		]);
		const leadPilgrim = pilgrimsResult.rows?.[0];
		if (leadPilgrim?.comments) {
			pilgrimComments = leadPilgrim.comments;
		}
	} catch {
		console.log('Failed to fetch lead pilgrim comments');
	}

	return json({
		success: true,
		hasApplication: true,
		applicationId: application.$id,
		currentStep: application.currentStep || 1,
		status: application.status,
		packageId: application.packageId,
		pilgrimCount: application.pilgrimCount || 0,
		preferredDepartureDate: application.preferredDepartureDate || null,
		pilgrimComments
	});
	} catch (error) {
		console.error('Failed to get user progress:', error);
		return json({ error: 'Failed to get progress', details: error.message }, { status: 500 });
	}
}
