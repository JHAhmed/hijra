import { env } from '$env/dynamic/private';

export async function POST({ request }) {
	let universities = [];

	const response = await fetch(env.HYGRAPH_PROJECT_ENVIRONMENT, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${env.HYGRAPH_PAT}`
		},
		body: JSON.stringify({
			query: `
        query {
          universities(first: 50) {
			id
            name
            image { url }
            location
			fees
			fieldOfStudy
			country
			commission
			description 
          }
        }
      `
		})
	});

	const data = await response.json();

	universities = data.data.universities;
	return new Response(JSON.stringify(universities));
}