import { json } from '@sveltejs/kit';
import { tablesDB, storage, ID, Query } from '$lib/server/appwrite.js';
import { env } from '$env/dynamic/public';

const DATABASE_ID = 'hijrah';
const BUCKET_ID = env.PUBLIC_APPWRITE_BUCKET_ID || 'pilgrim-documents';

/**
 * Find or create a batch for a specific date
 * @param {string} preferredDate - ISO date string for preferred departure
 */
async function findOrCreateBatchForDate(preferredDate) {
	const targetDate = new Date(preferredDate);
	const year = targetDate.getFullYear();
	const month = targetDate.getMonth();

	// Start of target month
	const startOfMonth = new Date(year, month, 1);
	// End of target month (last day)
	const endOfMonth = new Date(year, month + 1, 0);

	// Format month name
	const monthName = startOfMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

	// Try to find existing batch for this month
	const existingBatches = await tablesDB.listRows(DATABASE_ID, 'batches', [
		Query.greaterThanEqual('startDate', startOfMonth.toISOString()),
		Query.lessThanEqual('startDate', endOfMonth.toISOString()),
		Query.limit(1)
	]);

	if (existingBatches.rows && existingBatches.rows.length > 0) {
		return existingBatches.rows[0];
	}

	// Create new batch for this month
	const newBatch = await tablesDB.createRow(DATABASE_ID, 'batches', ID.unique(), {
		name: `${monthName} Batch`,
		startDate: startOfMonth.toISOString(),
		endDate: endOfMonth.toISOString(),
		status: 'open',
		maxCapacity: 50
	});

	return newBatch;
}

/**
 * POST /api/payments
 * Handle payment receipt upload and update application status
 */
export async function POST({ request }) {
	try {
		const formData = await request.formData();
		const applicationId = formData.get('applicationId');
		const userId = formData.get('userId');
		const receiptFile = formData.get('receipt');

		if (!applicationId || !userId || !receiptFile) {
			return json(
				{ error: 'Missing required fields: applicationId, userId, receipt' },
				{ status: 400 }
			);
		}

		// Upload receipt to Appwrite storage
		let receiptFileId = null;
		if (receiptFile && receiptFile.size > 0) {
			const uploadedFile = await storage.createFile(BUCKET_ID, ID.unique(), receiptFile);
			receiptFileId = uploadedFile.$id;
		}

		if (!receiptFileId) {
			return json({ error: 'Failed to upload receipt file' }, { status: 500 });
		}

		// Get application to check for preferred departure date
		const application = await tablesDB.getRow(DATABASE_ID, 'applications', applicationId);

		// Find or create batch based on preferred departure date
		let batchId = null;
		try {
			const preferredDate = application.preferredDepartureDate || new Date().toISOString();
			const batch = await findOrCreateBatchForDate(preferredDate);
			batchId = batch.$id;
		} catch (batchError) {
			console.error('Failed to assign batch:', batchError);
			// Continue without batch assignment - can be assigned manually later
		}

		// Update application with payment information and batch assignment
		// Move to step 4 (payment submitted) and unlock step 5 (journey dates)
		const updateData = {
			status: 'payment_submitted',
			currentStep: 4,
			paymentReceiptId: receiptFileId
		};

		if (batchId) {
			updateData.batchId = batchId;
		}

		await tablesDB.updateRow(DATABASE_ID, 'applications', applicationId, updateData);

		return json({
			success: true,
			message: 'Payment receipt uploaded successfully',
			receiptFileId,
			batchId
		});
	} catch (error) {
		console.error('Failed to process payment:', error);
		return json({ error: 'Failed to process payment', details: error.message }, { status: 500 });
	}
}

/**
 * GET /api/payments
 * Get payment details for an application
 */
export async function GET({ url }) {
	try {
		const applicationId = url.searchParams.get('applicationId');

		if (!applicationId) {
			return json({ error: 'Application ID is required' }, { status: 400 });
		}

		const application = await tablesDB.getRow(DATABASE_ID, 'applications', applicationId);

		if (!application) {
			return json({ error: 'Application not found' }, { status: 404 });
		}

		return json({
			success: true,
			payment: {
				status: application.status,
				receiptId: application.paymentReceiptId || null,
				submittedAt: application.paymentSubmittedAt || null,
				totalAmount: application.totalAmount || 450000 // Default amount
			}
		});
	} catch (error) {
		console.error('Failed to get payment details:', error);
		return json(
			{ error: 'Failed to get payment details', details: error.message },
			{ status: 500 }
		);
	}
}
