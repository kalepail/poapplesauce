import preprocess from "svelte-preprocess"
import adapter from '@sveltejs/adapter-cloudflare'
import inject from '@rollup/plugin-inject'
import path from 'path'

import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
// import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'

// import nodePolyfills from 'rollup-plugin-polyfill-node';
// import nodeResolve from '@rollup/plugin-node-resolve';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [
    preprocess({
      postcss: true,
    }),
  ],
	kit: {
		adapter: adapter(),
		// methodOverride: {
		// 	parameter: '_method',
		// 	allowed: ['PUT', 'PATCH', 'DELETE']
		// },
		vite: {
			optimizeDeps: {
				esbuildOptions: {
					define: {
						global: 'globalThis'
					},
					plugins: [
						NodeGlobalsPolyfillPlugin({
							buffer: true
						}),
					]
				}
			},
			build: {
				rollupOptions: {
					plugins: [
						inject({
							window: path.resolve('src/helpers/window.js'),
							Buffer: ['buffer', 'Buffer'],
						}),
					]
				}
			}
		},
	}
}

export default config