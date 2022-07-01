const gateways = [
  'https://ipfs.io/ipfs',
  'https://cloudflare-ipfs.com/ipfs',
  'https://gateway.pinata.cloud/ipfs',
  'https://ipfs.nftstorage.link/ipfs',
  'https://dweb.link/ipfs',
  'https://gateway.ipfs.io/ipfs',
  'https://infura-ipfs.io/ipfs',
  'https://nftstorage.link/ipfs',
  'https://ipfs.infura.io/ipfs',
  'https://ipfs-gateway.cloud/ipfs',
]

export default function getIPFS(cid) {
  const controllers = []
  const promises = gateways.map(async (gateway) => {
    const request = `${gateway}/${cid}`

    const controller = new AbortController()
    const { signal } = controller

    controllers.push(controller)

    return fetch(request, { 
      method: 'HEAD',
      cf: {cacheTtlByStatus: { '200-299': 3600 }},
      signal
    })
    .then((res) => {
      if (res.ok) {
        controllers.forEach((c) => {
          if (c !== controller)
            c.abort()
        })

        return fetch(request, {cf: {cacheTtlByStatus: { '200-299': 86400 }}})
      } throw res
    })
    .then((res) => {
      if (res.ok)
        return res.arrayBuffer()
      throw res
    })
  })

  return Promise
  .allSettled(promises)
  .then((resolved) => resolved.filter(({status}) => status === 'fulfilled')?.[0]?.value)
}