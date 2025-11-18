import { env } from '$env/dynamic/public';
// TODO: Check if this can be done with $lib/appwrite instead of $lib/server/appwrite
import { storage, tablesDB, Permission, Role } from '$lib/server/appwrite.js';

export async function POST({ request }) {
	const form = await request.formData();
	const userId = form.get('userId');
	const file = form.get('file');

	const table = form.get('table');
	const field = form.get('field');

	try {
		let fileId = null;
		if (file && file.size > 0) {
			const fileUploaded = await storage.createFile(
				env.PUBLIC_APPWRITE_BUCKET_ID,
				ID.unique(),
				file
			);
			fileId = fileUploaded.$id;
		}

		if (table && field && fileId) {
			await tablesDB.updateRow(
				env.PUBLIC_APPWRITE_DATABASE_ID,
				table,
				userId,
				{ [field]: fileId },
				[Permission.read(Role.user(userId)), Permission.update(Role.user(userId))]
			);
		}
	} catch (error) {
		console.error('Update failed:', error);
		return new Response(JSON.stringify({ error: 'Update failed', details: error }), {
			status: 500
		});
	}
	return new Response(JSON.stringify({ success: true, fileId: fileId }), { status: 200 });
}
