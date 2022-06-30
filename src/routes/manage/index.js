import { StrKey } from "stellar-base"
import { StatusError } from 'itty-router-extras'

export async function post({ request, platform, locals }) {
  const { env } = platform
  const { POAPS, POAP_LISTS } = env
  const body = await request.json()

  if (!await POAPS.get(`${locals.pubkey}:${body.poapPublicKey}`))
    throw new StatusError(404, 'POAP Not Found')

  const addresses = body.addresses.filter((address) => StrKey.isValidEd25519PublicKey(address))
  const existingAddresses = await POAP_LISTS.get(body.poapPublicKey, {type: 'json'}) || []
  const parsedAddresses = []
  .concat(addresses, existingAddresses)
  .filter((value, index, self) => self.indexOf(value) === index) // filter by unique

  await POAP_LISTS.put(body.poapPublicKey, JSON.stringify(parsedAddresses))

  return {
    status: 200
  }
}

export async function get({ platform, locals }) {
  const { pubkey } = locals

  if (!pubkey) return {
    status: 307,
    headers: {
      Location: '/'
    }
  }

  const { env } = platform
  const { POAPS } = env

  const { keys } = await POAPS.list({prefix: pubkey})
  
  return {
    status: 200,
    body: {
      poaps: keys
    }
  }
}