import { env } from '$env/dynamic/public';
import { tablesDB } from '$lib/server/appwrite.js';

export async function POST({ request }) {
	let { table } = await request.json();

	let data;

	try {
		data = await tablesDB.listRows('applications', table);
	} catch (error) {
		console.error('Update failed:', error);
		return new Response(JSON.stringify({ error: 'Update failed', details: error }), {
			status: 500
		});
	}
	return new Response(JSON.stringify({ data }), { status: 200 });
}
