import { env } from '$env/dynamic/private';

export async function GET({ params }) {
	const { packageId } = params;

	if (!packageId) {
		return new Response(JSON.stringify({ error: 'packageId required' }), { status: 400 });
	}

	let package = null;

	const response = await fetch(env.HYGRAPH_PROJECT_ENVIRONMENT, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${env.HYGRAPH_PAT}`
		},
		body: JSON.stringify({
			query: `
        query {
          package(where: {id: "${packageId}"}) {
            id
            name
            image { url }
            price
			type
            description
            }
            `
		})
	});

	const data = await response.json();
	package = data.data.package;

	return new Response(JSON.stringify(package));
}
