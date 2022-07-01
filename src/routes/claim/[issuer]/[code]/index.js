import { TransactionBuilder, Account, Networks, Operation, Asset } from "stellar-base"
import { StatusError } from 'itty-router-extras'

import { handleResponse } from "../../../../helpers/utils"

export async function post({ params, platform, locals }) {
  const { env } = platform
  const { HORIZON_URL, STELLAR_NETWORK, POAP_CODES, POAP_LISTS, POAP_CLAIMS } = env
  const { issuer, code } = params
  const userPublicKey = locals.pubkey

  if (await POAP_CLAIMS.get(`${userPublicKey}:${issuer}`))
    throw new StatusError(401, 'POAP Already Claimed')

  const addresses = await POAP_LISTS.get(issuer, {type: 'json'})

  if (!addresses?.includes(userPublicKey))
    throw new StatusError(401, 'POAP Claim Unauthorized')

  const poap = await POAP_CODES.getWithMetadata(`${code}:${issuer}`)
  const POAP = new Asset(poap.metadata.code, issuer)

  const transaction = await fetch(`${HORIZON_URL}/accounts/${userPublicKey}`)
  .then(handleResponse)
  .then((account) => {
    const transaction = new TransactionBuilder(
      new Account(account.id, account.sequence),
      {
        fee: 100_000,
        networkPassphrase: Networks[STELLAR_NETWORK]
      }
    )
    .addOperation(Operation.changeTrust({
      asset: POAP,
      limit: '0.0000001',
      source: userPublicKey
    }))
    .addOperation(Operation.setTrustLineFlags({
      trustor: userPublicKey,
      asset: POAP,
      flags: {
        authorized: true
      },
      source: issuer
    }))
    .addOperation(Operation.payment({
      destination: userPublicKey,
      asset: POAP,
      amount: '0.0000001',
      source: issuer
    }))
    .addOperation(Operation.setTrustLineFlags({
      trustor: userPublicKey,
      asset: POAP,
      flags: {
        authorized: false
      },
      source: issuer
    }))
    .setTimeout(0)
    .build()

    return transaction
  })

  return {
    status: 200,
    body: transaction.toXDR()
  }
}

export async function get({ params, url, platform, locals }) {
  const { env } = platform
  const { POAP_CODES, POAP_CLAIMS } = env
  const { issuer, code } = params
  const { pubkey } = locals

  const poap = await POAP_CODES.getWithMetadata(`${code}:${issuer}`)

  if (
    !poap?.metadata 
    || !poap?.value
  ) throw new StatusError(404, 'POAP Not Found')

  const claimed = !!await POAP_CLAIMS.get(`${pubkey}:${issuer}`)

  return {
    status: 200,
    body: {
      pubkey,
      issuer,
      code,
      poap,
      claimed,
      origin: url.origin
    }
  }
}