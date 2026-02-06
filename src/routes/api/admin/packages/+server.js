import { json } from '@sveltejs/kit';
import { tablesDB, storage, ID, Query } from '$lib/server/appwrite.js';

const DATABASE_ID = 'hijrah';
const COLLECTION_ID = 'packages';
const BUCKET_ID = 'pilgrim-documents';

/**
 * GET /api/admin/packages
 * Fetch all packages with optional filters
 */
export async function GET({ url }) {
	try {
		const limit = Math.min(parseInt(url.searchParams.get('limit') || '25'), 100);
		const offset = parseInt(url.searchParams.get('offset') || '0');
		const type = url.searchParams.get('type');
		const activeOnly = url.searchParams.get('activeOnly') === 'true';

		// Build query
		const queries = [Query.orderDesc('$createdAt'), Query.limit(limit), Query.offset(offset)];

		if (type) {
			queries.push(Query.equal('type', type));
		}

		if (activeOnly) {
			queries.push(Query.equal('isActive', true));
		}

		const result = await tablesDB.listRows(DATABASE_ID, COLLECTION_ID, queries);

		const packages = result.rows || [];
		const total = result.total || 0;

		// Add image URLs for each package
		const packagesWithImages = await Promise.all(
			packages.map(async (pkg) => {
				let imageUrl = null;
				if (pkg.imageId) {
					try {
						const fileView = storage.getFileView(BUCKET_ID, pkg.imageId);
						imageUrl = fileView.href;
					} catch {
						// Image not found, use fallback
					}
				}
				return { ...pkg, imageUrl };
			})
		);

		return json({
			success: true,
			packages: packagesWithImages,
			total,
			limit,
			offset
		});
	} catch (error) {
		console.error('Failed to fetch packages:', error);
		return json({ error: 'Failed to fetch packages', details: error.message }, { status: 500 });
	}
}

/**
 * POST /api/admin/packages
 * Create a new package
 */
export async function POST({ request }) {
	try {
		const data = await request.json();

		const { name, type, price, description, imageId, inclusions, duration, isActive } = data;

		if (!name || !type || price === undefined) {
			return json({ error: 'Name, type, and price are required' }, { status: 400 });
		}

		const pkg = await tablesDB.createRow(DATABASE_ID, COLLECTION_ID, ID.unique(), {
			name,
			type,
			price: parseFloat(price),
			description: description || '',
			imageId: imageId || null,
			inclusions: inclusions || [],
			duration: duration || '',
			isActive: isActive !== undefined ? isActive : true
		});

		return json({
			success: true,
			package: pkg
		});
	} catch (error) {
		console.error('Failed to create package:', error);
		return json({ error: 'Failed to create package', details: error.message }, { status: 500 });
	}
}
