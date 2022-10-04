<script context="module">
  import { account } from '@/store/account'
  import { handleResponse } from '@/helpers/utils'

  /** @type {import('./__types/[slug]').Load} */
  export async function load({ fetch, session, props }) {
    if (
      session.pubkey
      && !props.claimed
    ) await fetch(`${import.meta.env.VITE_HORIZON_URL}/accounts/${session.pubkey}`, {
      cf: {cacheTtlByStatus: { '200-299': 60 }}
    })
    .then(handleResponse)
    .then((res) => {
      account.set(res)

      props.claimed = res.balances.findIndex(({asset_issuer, asset_code}) => 
        asset_issuer === props.poap.metadata.issuer 
        && asset_code === props.poap.metadata.code
      ) > -1
    })
    .catch((err) => {
      if (err.status === 404) // Don't catch instances where the address hasn't been created yet
        return
      throw err
    })

    props.poapism = session.poapism

    return {
      status: 200,
      props
    }
  }
</script>

<script>
  import { onMount } from "svelte";

  import { login } from '@/components/Header.svelte'

  import ClaimDefault from "@/components/claim/ClaimDefault.svelte";
  import ClaimRanger from "@/components/claim/ClaimRanger.svelte";

  export let poapism
  export let pubkey
  export let issuer
  export let code
  export let poap
  export let origin
  export let claimed

  let albedo
  let loading = false

  onMount(async () => {
    albedo = await import('@albedo-link/intent').then((pkg) => pkg.default)
  })

  function claim() {
    loading = true

    return fetch(`/claim/${issuer}/${code}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json'
      }
    })
    .then(handleResponse)
    .then((xdr) => 
      albedo.tx({
        xdr,
        pubkey: pubkey,
        network: import.meta.env.VITE_STELLAR_NETWORK,
        description: `Claim ${poap.metadata.code} POAP`
      })
    )
    .then((res) => fetch(`/claim/${issuer}/${code}/xdr`, {
      method: 'POST',
      body: JSON.stringify(res)
    }))
    .then(handleResponse)
    .then(() => claimed = true)
    .finally(() => loading = false)
  }

  function isRangerNFT() {
    const rangerAddresses = [
      'GBS54CYAZ4I7SQEYG4VWW3HOA6ONNB3NM54ZM3ZS2I62T6VPNDO5IL6K',
      'GCTZLWO5OX2FVR7YQDBD7NDL7HQTIH2NZEJ36Q5YC6SE6QTYHNW76G5U',
      'GCT5IKQ6JYYU3YQZEHFHNZDHG6QA6IPZGAQFRGO3QS4I7M2DZPULISXB',
    ]
      
    return rangerAddresses.includes(issuer)
  }
</script>

{#if isRangerNFT()}
  <ClaimRanger {albedo} {loading} {poapism} {pubkey} {issuer} {code} {poap} {origin} {claimed} {claim} {login} />
{:else}
  <ClaimDefault {albedo} {loading} {poapism} {pubkey} {issuer} {code} {poap} {origin} {claimed} {claim} {login} />
{/if}