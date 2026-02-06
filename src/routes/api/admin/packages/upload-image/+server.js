import { json } from '@sveltejs/kit';
import { tablesDB, storage, ID } from '$lib/server/appwrite.js';

const DATABASE_ID = 'hijrah';
const COLLECTION_ID = 'packages';
const BUCKET_ID = 'pilgrim-documents'; // Using existing bucket

/**
 * POST /api/admin/packages/upload-image
 * Upload a package image to Appwrite storage
 */
export async function POST({ request }) {
	try {
		const form = await request.formData();
		const file = form.get('file');
		const packageId = form.get('packageId');

		if (!file || file.size === 0) {
			return json({ error: 'No file provided' }, { status: 400 });
		}

		// Upload file to Appwrite storage
		const uploadedFile = await storage.createFile(BUCKET_ID, ID.unique(), file);

		const fileId = uploadedFile.$id;

		// If packageId is provided, update the package with the new imageId
		if (packageId) {
			// First get the old package to delete old image if exists
			try {
				const oldPkg = await tablesDB.getRow(DATABASE_ID, COLLECTION_ID, packageId);
				if (oldPkg.imageId) {
					try {
						await storage.deleteFile(BUCKET_ID, oldPkg.imageId);
					} catch (err) {
						console.warn('Failed to delete old package image:', err.message);
					}
				}
			} catch (err) {
				// Package might not exist yet, that's OK
			}

			// Update the package with new imageId
			await tablesDB.updateRow(DATABASE_ID, COLLECTION_ID, packageId, {
				imageId: fileId
			});
		}

		// Get the image URL
		const imageUrl = storage.getFileView(BUCKET_ID, fileId).href;

		return json({
			success: true,
			fileId,
			imageUrl
		});
	} catch (error) {
		console.error('Failed to upload package image:', error);
		return json({ error: 'Failed to upload image', details: error.message }, { status: 500 });
	}
}

/**
 * DELETE /api/admin/packages/upload-image
 * Delete a package image from Appwrite storage
 */
export async function DELETE({ url }) {
	try {
		const fileId = url.searchParams.get('fileId');
		const packageId = url.searchParams.get('packageId');

		if (!fileId) {
			return json({ error: 'fileId is required' }, { status: 400 });
		}

		// Delete the file from storage
		await storage.deleteFile(BUCKET_ID, fileId);

		// If packageId provided, clear the imageId from the package
		if (packageId) {
			await tablesDB.updateRow(DATABASE_ID, COLLECTION_ID, packageId, {
				imageId: null
			});
		}

		return json({
			success: true,
			message: 'Image deleted successfully'
		});
	} catch (error) {
		console.error('Failed to delete package image:', error);
		return json({ error: 'Failed to delete image', details: error.message }, { status: 500 });
	}
}
