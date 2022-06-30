import { Keypair, Transaction, Networks } from "stellar-base"

import { handleResponse } from "../../helpers/utils"

export async function post({ request, platform }) {
  const { env } = platform
  const { HORIZON_URL, STELLAR_NETWORK, SIGNER_SK, POAPS, POAP_CODES } = env
  const body = await request.json()

  const poapKeypair = Keypair.fromSecret(SIGNER_SK)
  const transaction = new Transaction(body.signed_envelope_xdr, Networks[STELLAR_NETWORK])

  let userPublicKey
  let poapPublicKey
  let ipfshash
  let code

  transaction.operations.forEach((op) => {
    switch(op.type) {
      case 'createAccount':
        userPublicKey = op.source
      break;

      case 'setOptions':
        poapPublicKey = op.source
      break;

      case 'manageData':
        switch(op.name) {
          case 'ipfshash':
            ipfshash = op.value.toString('utf8')
          break;

          case 'code':
            code = op.value.toString('utf8')
          break;
        }
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

  const now = Date.now()

  await Promise.all([
    POAPS.put(`${userPublicKey}:${poapPublicKey}`, hash, {metadata: {
      author: userPublicKey,
      issuer: poapPublicKey,
      code,
      ipfshash,
      hash,
      date: now
    }}),
  
    POAP_CODES.put(`${code.toLowerCase()}:${poapPublicKey}`, 'OK', {metadata: {
      issuer: poapPublicKey,
      code,
      ipfshash,
      date: now
    }})
  ])

  return {
    status: 200,
    body: hash
  }
}