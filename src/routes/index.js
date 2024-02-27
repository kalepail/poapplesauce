import { serialize } from 'cookie'
// import alsv from '@albedo-link/signature-verification'
// import { StatusError } from 'itty-router-extras'

// const { verifyMessageSignature } = alsv

export async function post({ request, url, platform, locals }) {
  const { env } = platform
  const { NODE_ENV } = env
  const { href } = url
  const body = await request.json()

  // const isValid = verifyMessageSignature(
  //   body.pubkey,
  //   body.token,
  //   body.signature
  // )

  // if (!isValid)
  //   throw new StatusError(401, 'Invalid Signature')

  locals.pubkey = body.pubkey
  locals.wallet = body.wallet

  const headers = new Headers({
    'Location': href,
  })

  headers.set('Set-Cookie', serialize('pubkey', locals.pubkey, {
    path: '/',
    httpOnly: true,
    sameSite: 'strict',
    secure: NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  }))

  headers.append('Set-Cookie', serialize('wallet', locals.wallet, {
    path: '/',
    httpOnly: true,
    sameSite: 'strict',
    secure: NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  }))

  return {
    status: 200,
    headers
  }
}

export async function del({ url }) {
  const { href } = url

  const headers = new Headers({
    'Location': href,
  })

  headers.set('Set-Cookie', serialize('pubkey', '', {
    path: '/',
    maxAge: 0,
  }))

  headers.append('Set-Cookie', serialize('wallet', '', {
    path: '/',
    maxAge: 0,
  }))
  
  return {
    status: 200,
    headers
  }
}

export async function get({ request, url, locals, platform }) {
  // const { env, context } = platform
  // const { KV, DO } = env

  // const id = DO.idFromName('hello world')
  // const stub = DO.get(id)
  // const res = await stub.fetch(url)

  const { pubkey, wallet } = locals

  return {
    status: 200,
    body: {
      pubkey,
      wallet
    }
  }
}