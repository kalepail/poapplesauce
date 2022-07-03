import preprocess from "svelte-preprocess"
// import replacement from "rollup-plugin-module-replacement"
// import adapter from '@sveltejs/adapter-cloudflare'
import adapter from '@sveltejs/adapter-cloudflare-workers'
import inject from '@rollup/plugin-inject'
import path from 'path'
// import alias from '@rollup/plugin-alias'
// import replace from '@rollup/plugin-replace';

import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
// import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'

// import nodePolyfills from 'rollup-plugin-polyfill-node';
// import nodeResolve from '@rollup/plugin-node-resolve';

const argv = process.argv.slice(2)

const mode = argv.includes('build')
? argv.length === 1
	? 'production'
	: 'testnet'
: 'development'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [
    preprocess({
      postcss: true,
    }),
  ],
	kit: {
		adapter: adapter(),
		prerender: {
			onError(err) {
      	console.error(err)
      },
			enabled: false
		},
		vite: {
			mode,
			resolve: {
				alias: 
				// [
					{
						'@': path.resolve('src')
					}
					// { 
					// 	find: 'node:buffer', 
					// 	replacement: path.resolve('node_modules/buffer/index.js'), // './src/helpers/window.js' 
					// }
				// ]
				// alias: {
				// 	'node:buffer': './node_modules/buffer'
				// }
			},
			// define: {
			// 	['node:buffer']: 'buffer'
			// },
			optimizeDeps: {
				exclude: ['file-type'],
				esbuildOptions: {
					define: {
						global: 'globalThis'
					},
					plugins: [
						NodeGlobalsPolyfillPlugin({
							// process: true,
							buffer: true
						}),
						// NodeModulesPolyfillPlugin()
					]
				}
			},
			build: {
				// minify: false,
				// sourcemap: true,
				// commonjsOptions: {
				// 	include: [/file-type/, /node_modules/]
				// },
				rollupOptions: {
					plugins: [
						// replacement({
						// 	entries: [
						// 		{
						// 			find: /node:/,
						// 			replacement: importee => importee.replace(/^node:/, '')
						// 		}
						// 	]
						// }),
						// alias(
						// 	{
						// 		'node:buffer': path.resolve('node_modules/buffer/index.js')
						// 	}
							// {
							// entries: [
							// 	{ find: 'node:buffer', replacement: 'buffer' },
							// 	// { find: 'batman-1.0.0', replacement: './joker-1.5.0' }
							// ]
							// }
						// ),
						// replace({
						// 	include: [/node_modules/],
						// 	values: {
						// 		'node:buffer': JSON.stringify('buffer'),
						// 	}
						// }),
						inject({
							util: 'util',
							window: path.resolve('src/helpers/window.js'),
							Buffer: ['buffer', 'Buffer']
						}),
					]
				}
			}
		},
	}
}

export default config