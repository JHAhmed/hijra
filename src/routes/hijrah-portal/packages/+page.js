import { tablesDB } from '$lib/appwrite.js';

export async function load({ fetch, params }) {
	let packages;

	
	const res = await tablesDB.listRows('hijrah', 'packages');
	
	packages = res.rows;
	
	return { packages };
	// const res = await fetch(`/api/packages`, {
	// 	method: 'GET',
	// 	headers: {
	// 		'Content-Type': 'application/json'
	// 	}
	// });

	// const packages = await res.json();
}
