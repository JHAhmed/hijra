import { json } from '@sveltejs/kit';
import { tablesDB, storage, ID } from '$lib/server/appwrite.js';

const DATABASE_ID = 'hijrah';
const COLLECTION_ID = 'packages';
const BUCKET_ID = 'pilgrim-documents';

/**
 * GET /api/admin/packages/[id]
 * Fetch a single package by ID
 */
export async function GET({ params }) {
	try {
		const { id } = params;

		const pkg = await tablesDB.getRow(DATABASE_ID, COLLECTION_ID, id);

		// Get image URL if exists
		let imageUrl = null;
		if (pkg.imageId) {
			try {
				const fileView = storage.getFileView(BUCKET_ID, pkg.imageId);
				imageUrl = fileView.href;
			} catch {
				// Image not found
			}
		}

		return json({
			success: true,
			package: { ...pkg, imageUrl }
		});
	} catch (error) {
		console.error('Failed to fetch package:', error);
		return json({ error: 'Failed to fetch package', details: error.message }, { status: 500 });
	}
}

/**
 * PUT /api/admin/packages/[id]
 * Update a package
 */
export async function PUT({ params, request }) {
	try {
		const { id } = params;
		const data = await request.json();

		const { name, type, price, description, imageId, inclusions, duration, isActive } = data;

		const updateData = {};

		if (name !== undefined) updateData.name = name;
		if (type !== undefined) updateData.type = type;
		if (price !== undefined) updateData.price = parseFloat(price);
		if (description !== undefined) updateData.description = description;
		if (imageId !== undefined) updateData.imageId = imageId;
		if (inclusions !== undefined) updateData.inclusions = inclusions;
		if (duration !== undefined) updateData.duration = duration;
		if (isActive !== undefined) updateData.isActive = isActive;

		const pkg = await tablesDB.updateRow(DATABASE_ID, COLLECTION_ID, id, updateData);

		// Get image URL
		let imageUrl = null;
		if (pkg.imageId) {
			try {
				const fileView = storage.getFileView(BUCKET_ID, pkg.imageId);
				imageUrl = fileView.href;
			} catch {
				// Image not found
			}
		}

		return json({
			success: true,
			package: { ...pkg, imageUrl }
		});
	} catch (error) {
		console.error('Failed to update package:', error);
		return json({ error: 'Failed to update package', details: error.message }, { status: 500 });
	}
}

/**
 * DELETE /api/admin/packages/[id]
 * Delete a package and its associated image
 */
export async function DELETE({ params }) {
	try {
		const { id } = params;

		// Get package first to check for image
		const pkg = await tablesDB.getRow(DATABASE_ID, COLLECTION_ID, id);

		// Delete associated image if exists
		if (pkg.imageId) {
			try {
				await storage.deleteFile(BUCKET_ID, pkg.imageId);
			} catch (err) {
				console.warn('Failed to delete package image:', err.message);
			}
		}

		// Delete the package
		await tablesDB.deleteRow(DATABASE_ID, COLLECTION_ID, id);

		return json({
			success: true,
			message: 'Package deleted successfully'
		});
	} catch (error) {
		console.error('Failed to delete package:', error);
		return json({ error: 'Failed to delete package', details: error.message }, { status: 500 });
	}
}
