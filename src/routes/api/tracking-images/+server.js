import { json } from '@sveltejs/kit';
import { storage, tablesDB, ID, Query } from '$lib/server/appwrite.js';
import { env } from '$env/dynamic/public';

const DATABASE_ID = 'hijrah';
const BUCKET_ID = env.PUBLIC_APPWRITE_BUCKET_ID || 'pilgrim-documents';

/**
 * GET /api/tracking-images
 * Fetch images for a batch by batchId or trackingCode
 */
export async function GET({ url }) {
	try {
		const batchId = url.searchParams.get('batchId');
		const trackingCode = url.searchParams.get('trackingCode');

		if (!batchId && !trackingCode) {
			return json({ error: 'Either batchId or trackingCode is required' }, { status: 400 });
		}

		let targetBatchId = batchId;

		// If trackingCode provided, look up the batch first
		if (!batchId && trackingCode) {
			const batches = await tablesDB.listRows(DATABASE_ID, 'batches', [
				Query.equal('trackingCode', trackingCode.toUpperCase())
			]);

			if (!batches.rows || batches.rows.length === 0) {
				return json({ error: 'Batch not found' }, { status: 404 });
			}

			targetBatchId = batches.rows[0].$id;
		}

		// Fetch images for the batch
		const images = await tablesDB.listRows(DATABASE_ID, 'tracking_images', [
			Query.equal('batchId', targetBatchId),
			Query.orderDesc('uploadedAt'),
			Query.limit(50)
		]);

		// Build image URLs
		const imagesWithUrls = (images.rows || []).map((img) => ({
			...img,
			imageUrl: `${env.PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${img.fileId}/view?project=${env.PUBLIC_APPWRITE_PROJECT_ID}`
		}));

		return json({
			success: true,
			images: imagesWithUrls,
			total: images.total || 0
		});
	} catch (error) {
		console.error('Failed to fetch tracking images:', error);
		return json(
			{ error: 'Failed to fetch tracking images', details: error.message },
			{ status: 500 }
		);
	}
}

/**
 * POST /api/tracking-images
 * Upload a new image for a batch
 */
export async function POST({ request }) {
	try {
		const form = await request.formData();

		const file = form.get('file');
		const batchId = form.get('batchId');
		const caption = form.get('caption') || '';
		const activity = form.get('activity') || '';
		const uploadedBy = form.get('uploadedBy') || '';

		if (!file || file.size === 0) {
			return json({ error: 'No file provided' }, { status: 400 });
		}

		if (!batchId) {
			return json({ error: 'batchId is required' }, { status: 400 });
		}

		// Verify batch exists
		try {
			await tablesDB.getRow(DATABASE_ID, 'batches', batchId);
		} catch {
			return json({ error: 'Batch not found' }, { status: 404 });
		}

		// Upload file to Appwrite Storage
		const uploadedFile = await storage.createFile(BUCKET_ID, ID.unique(), file);

		// Create tracking_images record
		const imageRecord = await tablesDB.createRow(DATABASE_ID, 'tracking_images', ID.unique(), {
			batchId,
			fileId: uploadedFile.$id,
			caption: caption.trim(),
			activity: activity.trim(),
			uploadedAt: new Date().toISOString(),
			uploadedBy
		});

		const imageUrl = `${env.PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${uploadedFile.$id}/view?project=${env.PUBLIC_APPWRITE_PROJECT_ID}`;

		return json({
			success: true,
			image: {
				...imageRecord,
				imageUrl
			}
		});
	} catch (error) {
		console.error('Failed to upload tracking image:', error);
		return json({ error: 'Failed to upload image', details: error.message }, { status: 500 });
	}
}

/**
 * DELETE /api/tracking-images
 * Delete an image by its document ID
 */
export async function DELETE({ url }) {
	try {
		const imageId = url.searchParams.get('imageId');

		if (!imageId) {
			return json({ error: 'imageId is required' }, { status: 400 });
		}

		// Get the image record to find the fileId
		const imageRecord = await tablesDB.getRow(DATABASE_ID, 'tracking_images', imageId);

		if (!imageRecord) {
			return json({ error: 'Image not found' }, { status: 404 });
		}

		// Delete file from storage
		try {
			await storage.deleteFile(BUCKET_ID, imageRecord.fileId);
		} catch (err) {
			console.warn('Failed to delete file from storage:', err);
			// Continue to delete the record even if file deletion fails
		}

		// Delete the database record
		await tablesDB.deleteRow(DATABASE_ID, 'tracking_images', imageId);

		return json({
			success: true,
			message: 'Image deleted successfully'
		});
	} catch (error) {
		console.error('Failed to delete tracking image:', error);
		return json({ error: 'Failed to delete image', details: error.message }, { status: 500 });
	}
}
