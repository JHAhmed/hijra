import { json } from '@sveltejs/kit';
import { users, Query } from '$lib/server/appwrite.js';

/**
 * GET /api/admin/guides
 * Get all users with the "guide" label
 */
export async function GET({ url }) {
	try {
		const limit = Math.min(parseInt(url.searchParams.get('limit') || '50'), 100);
		const offset = parseInt(url.searchParams.get('offset') || '0');

		// Fetch users with "guide" label
		const result = await users.list([
			Query.contains('labels', ['guide']),
			Query.limit(limit),
			Query.offset(offset)
		]);

		const guides = (result.users || []).map((user) => ({
			$id: user.$id,
			name: user.name,
			email: user.email,
			phone: user.phone || null
		}));

		return json({
			success: true,
			guides,
			total: result.total || 0
		});
	} catch (error) {
		console.error('Failed to fetch guides:', error);
		return json({ error: 'Failed to fetch guides', details: error.message }, { status: 500 });
	}
}
