import getIPFS from '../../helpers/getIPFS'

export async function get({ params }) {
  return {
    status: 200,
    body: new Uint8Array(await getIPFS(params.cid))
  }
}