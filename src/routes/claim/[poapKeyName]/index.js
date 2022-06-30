import { TransactionBuilder, Account, Networks, Operation, Asset } from "stellar-base"
import { StatusError } from 'itty-router-extras'

import { handleResponse } from "../../../helpers/utils"

export async function post({ params, platform, locals }) {
  const { env } = platform
  const { HORIZON_URL, STELLAR_NETWORK, POAPS, POAP_LISTS } = env
  const { poapKeyName } = params
  const [ authorPublicKey, issuerPublicKey ] = poapKeyName.split(':')
  const userPublicKey = locals.pubkey

  const addresses = await POAP_LISTS.get(issuerPublicKey, {type: 'json'})

  if (!addresses?.includes(userPublicKey))
    throw new StatusError(401, 'POAP Claim Unauthorized')

  const poap = await POAPS.getWithMetadata(poapKeyName)
  const POAP = new Asset(poap.metadata.code, issuerPublicKey)

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
      source: issuerPublicKey
    }))
    .addOperation(Operation.payment({
      destination: userPublicKey,
      asset: POAP,
      amount: '0.0000001',
      source: issuerPublicKey
    }))
    .addOperation(Operation.setTrustLineFlags({
      trustor: userPublicKey,
      asset: POAP,
      flags: {
        authorized: false
      },
      source: issuerPublicKey
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
  const { POAPS } = env
  const { poapKeyName } = params

  const poap = await POAPS.getWithMetadata(poapKeyName)

  if (
    !poap?.metadata 
    || !poap?.value
  ) throw new StatusError(404, 'POAP Not Found')

  return {
    status: 200,
    body: {
      pubkey: locals.pubkey,
      poapKeyName,
      poap,
      origin: url.origin
    }
  }
}