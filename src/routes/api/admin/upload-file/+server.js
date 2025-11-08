import { env } from '$env/dynamic/public';
import { ID, Permission, Role, storage, tablesDB } from '$lib/server/appwrite.js';

export async function POST({ request }) {

	const form = await request.formData();

	const userId = form.get('userId');
	const fileFile = form.get('file');

	let fileId;

	try {
		if (fileFile && fileFile.size > 0) {
			const offerFile = await storage.createFile(
				env.PUBLIC_APPWRITE_BUCKET_ID, // Find in Storage -> Bucket -> Settings
				ID.unique(),
				fileFile
			);
			fileId = offerFile.$id;
		}

		await tablesDB.updateRow(
			env.PUBLIC_APPWRITE_DATABASE_ID,
			'details',
			userId,
			{ fileId },
			[Permission.read(Role.user(userId)), Permission.update(Role.user(userId))]
		);

		await tablesDB.updateRow(env.PUBLIC_APPWRITE_DATABASE_ID, 'progress', userId, {
			fileReceived: true
		});
	} catch (error) {
		console.error('Submission failed:', error);
		return new Response(JSON.stringify({ error: 'Submission failed', details: error }), {
			status: 500
		});
	}

	return new Response(JSON.stringify({ success: true, fileId: fileId }), { status: 200 });
}
