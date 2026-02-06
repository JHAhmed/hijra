import { json } from '@sveltejs/kit';
import { tablesDB, storage } from '$lib/server/appwrite.js';

const DATABASE_ID = 'hijrah';
const COLLECTION_ID = 'packages';
const BUCKET_ID = 'pilgrim-documents';

export async function GET({ params }) {
	const { packageId } = params;

	if (!packageId) {
		return new Response(JSON.stringify({ error: 'packageId required' }), { status: 400 });
	}

	try {
		const pkg = await tablesDB.getRow(DATABASE_ID, COLLECTION_ID, packageId);

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

		const travelPackage = {
			id: pkg.$id,
			name: pkg.name,
			type: pkg.type,
			price: pkg.price,
			description: pkg.description,
			duration: pkg.duration,
			inclusions: pkg.inclusions || [],
			image: { url: imageUrl }
		};

		return new Response(JSON.stringify(travelPackage));
	} catch (error) {
		console.error('Failed to fetch package:', error);
		return new Response(JSON.stringify({ error: 'Package not found' }), { status: 404 });
	}
}
