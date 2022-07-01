import getIPFS from '../../helpers/getIPFS'

export async function get({ params }) {
  return {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=86400' // 1 day
    },
    body: new Uint8Array(await getIPFS(params.cid))
  }
}