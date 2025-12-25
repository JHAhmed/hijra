export async function load({ params, fetch }) {
	const { code } = params;

	try {
		const response = await fetch(`/api/tracking/${code}`);
		const data = await response.json();

		if (!response.ok) {
			return {
				error: data.error || 'Failed to load tracking data',
				code
			};
		}

		return {
			...data,
			code
		};
	} catch (error) {
		return {
			error: 'Failed to load tracking data',
			code
		};
	}
}
