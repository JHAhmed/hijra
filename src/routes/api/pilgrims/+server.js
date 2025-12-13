import { json } from '@sveltejs/kit';
import { tablesDB, ID, Query } from '$lib/server/appwrite.js';

const DATABASE_ID = 'hijrah';

/**
 * GET /api/pilgrims?applicationId=xxx
 * Fetch all pilgrims for a given application
 */
export async function GET({ url }) {
	try {
		const applicationId = url.searchParams.get('applicationId');

		if (!applicationId) {
			return json({ error: 'Application ID is required' }, { status: 400 });
		}

		const result = await tablesDB.listRows(DATABASE_ID, 'pilgrims', [
			Query.equal('applicationId', applicationId)
		]);

		const pilgrims = result.rows || [];

		// Separate lead pilgrim from family members
		const leadPilgrim = pilgrims.find((p) => p.isLead === true) || null;
		const familyMembers = pilgrims.filter((p) => p.isLead !== true);

		return json({
			success: true,
			leadPilgrim,
			familyMembers
		});
	} catch (error) {
		console.error('Failed to fetch pilgrims:', error);
		return json({ error: 'Failed to fetch pilgrims', details: error.message }, { status: 500 });
	}
}

/**
 * POST /api/pilgrims
 * Create lead pilgrim and family members in a single request
 */
export async function POST({ request }) {
	try {
		const { applicationId, leadPilgrim, familyMembers = [] } = await request.json();

		if (!applicationId) {
			return json({ error: 'Application ID is required' }, { status: 400 });
		}

		if (!leadPilgrim || !leadPilgrim.firstName || !leadPilgrim.lastName) {
			return json({ error: 'Lead pilgrim details are required' }, { status: 400 });
		}

		const createdPilgrims = [];

		// Create lead pilgrim
		const leadPilgrimRes = await tablesDB.createRow(DATABASE_ID, 'pilgrims', ID.unique(), {
			applicationId,
			isLead: true,
			firstName: leadPilgrim.firstName,
			lastName: leadPilgrim.lastName,
			email: leadPilgrim.email || null,
			phone: leadPilgrim.phone || null,
			gender: leadPilgrim.gender || null,
			// dob: leadPilgrim.dob || null,
			passportNumber: leadPilgrim.passportNumber || null,
			passportExpiry: leadPilgrim.passportExpiry || null,
			relation: null
		});

		createdPilgrims.push({
			$id: leadPilgrimRes.$id,
			isLead: true,
			firstName: leadPilgrim.firstName,
			lastName: leadPilgrim.lastName
		});

		// Create family members
		for (const member of familyMembers) {
			if (!member.firstName || !member.lastName) continue;

			const memberRes = await tablesDB.createRow(DATABASE_ID, 'pilgrims', ID.unique(), {
				applicationId,
				isLead: false,
				firstName: member.firstName,
				lastName: member.lastName,
				email: null,
				phone: null,
				gender: member.gender || null,
				// dob: member.dob || null,
				passportNumber: member.passportNumber || null,
				passportExpiry: member.passportExpiry || null,
				relation: member.relation || null
			});

			createdPilgrims.push({
				$id: memberRes.$id,
				isLead: false,
				firstName: member.firstName,
				lastName: member.lastName,
				relation: member.relation
			});
		}

		// Update application with pilgrim count and status
		await tablesDB.updateRow(DATABASE_ID, 'applications', applicationId, {
			status: 'details_submitted',
			currentStep: 2,
			pilgrimCount: createdPilgrims.length
		});

		return json({
			success: true,
			pilgrims: createdPilgrims
		});
	} catch (error) {
		console.error('Failed to create pilgrims:', error);
		return json({ error: 'Failed to create pilgrims', details: error.message }, { status: 500 });
	}
}
