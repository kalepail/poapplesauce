import { fileTypeFromBuffer } from 'file-type/core'

import getIPFS from '@/helpers/getIPFS'

export async function get({ params }) {
  const buffer = new Uint8Array(await getIPFS(params.cid))
  const { mime } = await fileTypeFromBuffer(buffer)

  return {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': mime,
      'Cache-Control': 'public, max-age=86400' // 1 day
    },
    body: buffer
  }
}