import { env } from '$env/dynamic/public';

export async function POST({ request }) {
	const { fileId } = await request.json();

	const projectId = env.PUBLIC_APPWRITE_PROJECT_ID;
	const endpoint = env.PUBLIC_APPWRITE_ENDPOINT;
	const bucketId = 'marksheets';

	if (!fileId || !projectId || !endpoint) {
		return new Response(JSON.stringify({ error: 'Missing required information' }), {
			status: 400
		});
	}

	const fileUrl = `${endpoint}/storage/buckets/${bucketId}/files/${fileId}/view?project=${projectId}`;

	return new Response(
		JSON.stringify({
			url: fileUrl
		}),
		{ status: 200 }
	);
}
