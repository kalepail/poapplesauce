import { serialize } from 'cookie'
import alsv from '@albedo-link/signature-verification'
import { StatusError } from 'itty-router-extras'

const { verifyMessageSignature } = alsv

export async function post({ request, url, locals }) {
  const { href } = url
  const body = await request.json()

  const isValid = verifyMessageSignature(
    body.pubkey,
    body.token,
    body.signature
  )

  if (!isValid)
    throw new StatusError(401, 'Invalid Signature')

  locals.pubkey = body.pubkey

  return {
    status: 200,
    headers: {
      'Location': href,
      'Set-Cookie': serialize('pubkey', locals.pubkey, {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // one week
      })
    }
  }
}

export async function del({ url }) {
  const { href } = url

  return {
    status: 200,
    headers: {
      'Location': href,
      'Set-Cookie': serialize('pubkey', '', {
        path: '/',
        maxAge: 0,
      }),
    }
  }
}

export async function get({ request, url, locals, platform }) {
  // const { env, context } = platform
  // const { KV, DO } = env

  // const id = DO.idFromName('hello world')
  // const stub = DO.get(id)
  // const res = await stub.fetch(url)

  const { pubkey } = locals

  return {
    status: 200,
    body: {
      pubkey
    }
  }
}