import { StatusError } from "itty-router-extras"
import { Networks } from "stellar-base"

export async function get({ url, platform }) {
  const { env } = platform
  const { STELLAR_NETWORK, SIGNER_PK, POAP_CODES } = env

  const domain = url.host.split('.')
  const code = domain.shift()?.replace('-poap', '')
  const { keys } = await POAP_CODES.list({prefix: `${code}:`})

  if (!keys?.length)
    throw new StatusError(404, 'POAPs Not Found')

  let toml = `VERSION="2.1.0"

NETWORK_PASSPHRASE="${Networks[STELLAR_NETWORK]}"

ACCOUNTS=[
  "${SIGNER_PK}",
  ${keys.map((key) => `"${key.metadata.issuer}"`).join(',\n  ')}
]

[DOCUMENTATION]
ORG_NAME="Stellar POAPs"
ORG_URL="https://poap.stellar.quest"
ORG_LOGO="https://poap.stellar.quest/favicon.png"
ORG_OFFICIAL_EMAIL="ecosystem@stellar.org"
ORG_SUPPORT_EMAIL="ecosystem@stellar.org"

[[PRINCIPALS]]
name="Tyler van der Hoeven"
email="tyler@stellar.org"
keybase="tyvdh"
twitter="tyvdh"
github="tyvdh"

${keys.map((key) => `[[CURRENCIES]]
code="${key.metadata.code}"
issuer="${key.metadata.issuer}"
image="${url.protocol}//poap.${domain.join('.')}/ipfs/${key.metadata.ipfshash}.${key.metadata.ext}"`
).join('\n\n')}
`

  return {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=3600' // 1 hour
    },
    body: toml,
  }
}