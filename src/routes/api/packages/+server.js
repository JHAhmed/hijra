import { env } from '$env/dynamic/private';

export async function GET({ request }) {
	let packages = [];

	const response = await fetch(env.HYGRAPH_PROJECT_ENVIRONMENT, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${env.HYGRAPH_PAT}`
		},
		body: JSON.stringify({
			query: `
        query {
          packages(first: 50) {
			id
            name
            image { url }
			price
			type
			description 
          }
        }
      `
		})
	});

	const data = await response.json();

	packages = data.data.packages;
	return new Response(JSON.stringify(packages));
}