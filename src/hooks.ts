import { parse } from 'cookie'
import { error } from 'itty-router-extras'

import cloudflareAdapterPlatform from './helpers/_mf'
import poapisms from './helpers/poap.json'

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  const { request, url, platform, locals } = event
  const { method, headers } = request
  const cookies = parse(headers.get('cookie') || '')

  event.platform = await cloudflareAdapterPlatform(platform)
	locals.pubkey = cookies.pubkey

  const { context } = event.platform
  const cache = caches.default

  let response = await cache.match(url)

  if (response)
    return new Response(response.body, response)

  try {
    response = await resolve(event)
    const { headers: h } = response

    if (
      method === 'GET' 
      && h.get('cache-control')
      && h.get('cache-control') !== 'no-cache'
      && h.get('pragma') !== 'no-cache'
      && (
        !h.get('content-type')
        || (
          h.get('content-type')?.indexOf('html') === -1
          && h.get('content-type')?.indexOf('javascript') === -1
        )
      )
    ) context.waitUntil(cache.put(url, response.clone()))
  } catch (err) {
    response = error(err.status, err.message || err)
  }

  return response
}

/** @type {import('@sveltejs/kit').HandleError} */
export async function handleError({ error, event }) {
  
}

/** @type {import('@sveltejs/kit').GetSession} */
export function getSession(event) {
  const { locals } = event
  const { pubkey } = locals

  // https://github.com/sveltejs/kit/issues/4274
  const poapism = poapisms[Math.floor(Math.random() * poapisms.length)] 

  return {
    pubkey,
    poapism
  }
}