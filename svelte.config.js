import preprocess from "svelte-preprocess"
import adapter from '@sveltejs/adapter-cloudflare-workers'
import inject from '@rollup/plugin-inject'
import path from 'path'

import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'

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
				alias: {
					'@': path.resolve('src')
				}
			},
			optimizeDeps: {
				// exclude: ['file-type'],
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