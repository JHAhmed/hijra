import { tablesDB } from '$lib/server/appwrite.js';

export async function load() {
	const res = await tablesDB.listRows('hijrah', 'packages');
	return { packages: res.rows };
	// const res = await fetch(`/api/packages`, {
	// 	method: 'GET',
	// 	headers: {
	// 		'Content-Type': 'application/json'
	// 	}
	// });

	// const packages = await res.json();
}
