import { Keypair, Transaction, Networks } from "stellar-base"

import { handleResponse } from "../../../helpers/utils"

export async function post({ request, platform }) {
  const { env } = platform
  const { HORIZON_URL, STELLAR_NETWORK, SIGNER_SK, POAP_CLAIMS } = env
  const body = await request.json()

  const poapKeypair = Keypair.fromSecret(SIGNER_SK)
  const transaction = new Transaction(body.signed_envelope_xdr, Networks[STELLAR_NETWORK])

  let userPublicKey
  let poapPublicKey

  transaction.operations.forEach((op) => {
    switch(op.type) {
      case 'changeTrust':
        userPublicKey = op.source
      break;

      case 'payment':
        poapPublicKey = op.source
      break;
    }
  })

  transaction.sign(poapKeypair)

  const txBody = new FormData()
        txBody.append('tx', transaction.toXDR())

  const { hash } = await fetch(`${HORIZON_URL}/transactions`, {
    method: 'POST',
    body: txBody
  })
  .then(handleResponse)

  await POAP_CLAIMS.put(`${userPublicKey}:${poapPublicKey}`, hash, {metadata: {
    hash,
    date: Date.now()
  }})

  return {
    status: 200,
    body: hash
  }
}