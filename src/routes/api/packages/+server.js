import { json } from '@sveltejs/kit';
import { tablesDB, storage, Query } from '$lib/server/appwrite.js';

const DATABASE_ID = 'hijrah';
const COLLECTION_ID = 'packages';
const BUCKET_ID = 'pilgrim-documents';

export async function GET({ url }) {
	try {
		const type = url.searchParams.get('type');

		// Build query - only fetch active packages for public API
		const queries = [Query.equal('isActive', true), Query.orderDesc('$createdAt'), Query.limit(50)];

		if (type) {
			queries.push(Query.equal('type', type));
		}

		const result = await tablesDB.listRows(DATABASE_ID, COLLECTION_ID, queries);
		const packages = result.rows || [];

		// Add image URLs for each package
		const packagesWithImages = await Promise.all(
			packages.map(async (pkg) => {
				let imageUrl = null;
				if (pkg.imageId) {
					try {
						const fileView = storage.getFileView(BUCKET_ID, pkg.imageId);
						imageUrl = fileView.href;
					} catch (error) {
						console.log('Image not found for package:', pkg.$id);
						// Image not found, use fallback
					}
				}
				return {
					id: pkg.$id,
					name: pkg.name,
					type: pkg.type,
					price: pkg.price,
					description: pkg.description,
					duration: pkg.duration,
					inclusions: pkg.inclusions || [],
					image: { url: imageUrl }
				};
			})
		);

		return new Response(JSON.stringify(packagesWithImages));
	} catch (error) {
		console.error('Failed to fetch packages:', error);
		return json({ error: 'Failed to fetch packages' }, { status: 500 });
	}
}
