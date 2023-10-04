import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	experimental: { prebundleSvelteLibraries: true },
	kit: {
		adapter: adapter({
			pages: 'docs'
		})
	}
};

export default config;
