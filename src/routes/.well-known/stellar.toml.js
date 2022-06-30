import { StatusError } from "itty-router-extras"
import { Networks } from "stellar-base"

export async function get({ url, platform }) {
  const { env } = platform
  const { STELLAR_NETWORK, SIGNER_PK, POAP_CODES } = env

  const domain = url.host.split('.')
  const subdomain = domain.shift()?.replace('poap-', '')
  const { keys } = await POAP_CODES.list({prefix: subdomain})

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
ORG_URL="https://poap.stellar.org"
ORG_LOGO="https://poap.stellar.org/favicon.png"
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
image="${url.protocol}//poap.${domain.join('.')}/ipfs/${key.metadata.ipfshash}"`
).join('\n\n')}
`

  return {
    status: 200,
    header: {
      'Content-Type': 'text/plain'
    },
    body: toml,
  }
}