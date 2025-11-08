import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
	kit: {
		adapter: adapter({
			maxDuration: 55,
		  }),
		alias: {
			$components: 'src/lib/components',
			$shared: 'src/lib/shared',
		},
	},
	preprocess: vitePreprocess(),
	vitePlugin: {
		inspector: true
	},
};
export default config;