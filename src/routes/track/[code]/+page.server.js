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

		// Fetch images for this tracking code
		let images = [];
		try {
			const imagesResponse = await fetch(`/api/tracking-images?trackingCode=${code}`);
			const imagesData = await imagesResponse.json();
			if (imagesResponse.ok && imagesData.success) {
				images = imagesData.images || [];
			}
		} catch (err) {
			console.error('Failed to fetch tracking images:', err);
		}

		return {
			...data,
			images,
			code
		};
	} catch (error) {
		return {
			error: 'Failed to load tracking data',
			code
		};
	}
}
