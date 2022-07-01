import { parse } from 'cookie'
import { error } from 'itty-router-extras'

import cloudflareAdapterPlatform from './helpers/_mf'
import poapisms from './helpers/poap.json'

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  const { request, platform, locals } = event
  const { headers } = request
  const cookies = parse(headers.get('cookie') || '')
  
  event.platform = await cloudflareAdapterPlatform(platform)
	locals.pubkey = cookies.pubkey

  let response

  try {
    response = await resolve(event)
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
  const poapism = poapisms[Math.floor(Math.random() * poapisms.length)]

  return {
    pubkey,
    poapism
  }
}