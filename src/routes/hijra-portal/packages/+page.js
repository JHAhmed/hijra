export async function load({ fetch, params }) {

    const res = await fetch(`/api/packages`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	});

    const packages = await res.json();
    return { packages };

}