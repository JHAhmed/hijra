import { json } from '@sveltejs/kit';
import { tablesDB, storage, ID } from '$lib/server/appwrite.js';
import { env } from '$env/dynamic/public';

const DATABASE_ID = 'hijrah';
const BUCKET_ID = env.PUBLIC_APPWRITE_BUCKET_ID || 'pilgrim-documents';

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

		// Update application with payment information
		// Move to step 4 (payment submitted) and unlock step 5 (journey dates)
		await tablesDB.updateRow(DATABASE_ID, 'applications', applicationId, {
			status: 'payment_submitted',
			currentStep: 4,
			paymentReceiptId: receiptFileId
			// paymentSubmittedAt: new Date().toISOString()
		});

		return json({
			success: true,
			message: 'Payment receipt uploaded successfully',
			receiptFileId
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
