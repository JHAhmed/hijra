// Example structure - adapt based on your data sources
// import { fetchBlogPosts } from '$lib/server/database'; // Example function to get posts

export async function GET({ url }) {
	const lastmod = '2025-10-31';
	const staticPages = [
		'/',
		'/about',
		'/auth',
		'/contact',
		'/our-packages',
		'/hijra-portal',
		'/hijra-portal/application',
		'/faq',
	]; 
    
    // Your static pages
	// const posts = await fetchBlogPosts(); // Fetch dynamic content

	let xml = '<?xml version="1.0" encoding="UTF-8"?>';
	xml += `<urlset
			xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
			xmlns:xhtml="https://www.w3.org/1999/xhtml"
			xmlns:mobile="https://www.google.com/schemas/sitemap-mobile/1.0"
			xmlns:news="https://www.google.com/schemas/sitemap-news/0.9"
			xmlns:image="https://www.google.com/schemas/sitemap-image/1.1"
			xmlns:video="https://www.google.com/schemas/sitemap-video/1.1"
		>`;

	// Add static pages
	staticPages.forEach((page) => {
		xml += `<url><loc>${url.origin}${page}</loc><lastmod>${lastmod}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>`;
	});

	// Add dynamic pages (e.g., blog posts)
	// posts.forEach(post => {
	//     xml += `<url>`;
	//     xml += `<loc>${url.origin}/blog/${post.slug}</loc>`;
	//     if (post.updated_at) {
	//         xml += `<lastmod>${new Date(post.updated_at).toISOString().split('T')[0]}</lastmod>`; // Format date as YYYY-MM-DD
	//     }
	//     xml += `<changefreq>daily</changefreq>`;
	//     xml += `<priority>0.6</priority>`;
	//     xml += `</url>`;
	// });

	xml += '</urlset>';

	const response = new Response(xml);
	response.headers.set('Cache-Control', 'max-age=0, s-maxage=3600'); // Optional caching
	response.headers.set('Content-Type', 'application/xml');
	return response;
}