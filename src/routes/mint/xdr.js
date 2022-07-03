// import { StatusError } from "itty-router-extras"
import { Keypair, Transaction, Networks } from "stellar-base"
import { fileTypeFromBuffer } from 'file-type/core'

import { handleResponse } from "@/helpers/utils"
import getIPFS from '@/helpers/getIPFS'

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

  const buffer = new Uint8Array(await getIPFS(ipfshash))
  const { ext, mime } = await fileTypeFromBuffer(buffer)

  transaction.sign(poapKeypair)

  const txBody = new FormData()
        txBody.append('tx', transaction.toXDR())

  // TEMP TO ENSURE SAFETY
  ////
  // SAFE WHILE WE HAVE CF ZERO TRUST
  // if (STELLAR_NETWORK === 'PUBLIC')
  //   throw new StatusError(401, `Address ${userPublicKey} Not Allowed`)
  ////

  const { hash } = await fetch(`${HORIZON_URL}/transactions`, {
    method: 'POST',
    body: txBody
  })
  .then(handleResponse)

  const metadata = {
    author: userPublicKey,
    issuer: poapPublicKey,
    code,
    ipfshash,
    hash,
    ext,
    mime,
    date: Date.now()
  }

  await Promise.all([
    POAPS.put(`${userPublicKey}:${poapPublicKey}`, hash, { metadata }),
    POAP_CODES.put(`${code.toLowerCase()}:${poapPublicKey}`, 'OK', { metadata })
  ])

  return {
    status: 200,
    body: hash
  }
}