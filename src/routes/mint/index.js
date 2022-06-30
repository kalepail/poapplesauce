import { Keypair, TransactionBuilder, Account, Networks, Operation } from "stellar-base"

import { handleResponse } from '../../helpers/utils'

export async function post({ request, platform, locals }) {
  const { env } = platform
  const { HORIZON_URL, STELLAR_NETWORK, SIGNER_PK } = env
  const body = await request.json()

  const userPublicKey = locals.pubkey

  const poapKeypair = Keypair.random()
  const poapPublicKey = poapKeypair.publicKey()

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
    .addOperation(Operation.createAccount({
      destination: poapPublicKey,
      startingBalance: '3',
      source: userPublicKey
    }))
    .addOperation(Operation.setOptions({
      masterWeight: 0,
      setFlags: 11, // auth required, revokable and clawbackable
      signer: {
        ed25519PublicKey: userPublicKey,
        weight: 1
      },
      source: poapPublicKey
    }))
    .addOperation(Operation.setOptions({
      homeDomain: `poap-${body.code.toLowerCase()}.stellar.quest`,
      signer: {
        ed25519PublicKey: SIGNER_PK,
        weight: 1
      },
      source: poapPublicKey
    }))
    .addOperation(Operation.manageData({
      name: 'ipfshash',
      value: body.ipfshash,
      source: poapPublicKey
    }))
    .addOperation(Operation.manageData({
      name: 'code',
      value: body.code,
      source: poapPublicKey
    }))
    .setExtraSigners([SIGNER_PK]) // Require the backend service extra signer to ensure we control the submission of the xdr
    .setTimeout(0)
    .build()

    transaction.sign(poapKeypair)

    return transaction
  })

  return {
    status: 200,
    body: transaction.toXDR()
  }
}

export async function get({ url, locals }) {
  const { pubkey } = locals

  if (pubkey) return {
    status: 200,
    body: {
      pubkey,
      origin: url.origin
    }
  }
  
  else return {
    status: 307,
    headers: {
      Location: '/'
    }
  }
}