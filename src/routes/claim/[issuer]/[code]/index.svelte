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

    return {
      status: 200,
      props
    }
  }
</script>

<script>
  import { onMount } from "svelte";

  import { login } from '@/components/Header.svelte'

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
        description: `Claim ${poap.metadata.code} POAP`,
        submit: false
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
</script>

<h1 class="mb-2">Claim POAP</h1>

<img class="mr-2 self-start" style:max-width="calc(16px * 4)" src="{origin}/ipfs/{poap.metadata.ipfshash}">
<div class="flex flex-col items-start">
  <span>{poap.metadata.code}</span>
  <span>{poap.metadata.issuer}</span>

  {#if pubkey}
    {#if claimed}
      <span class="bg-green-500 text-white px-2 h-8 flex items-center rounded mt-1">Claimed</span>
    {:else}
      <button class="bg-black text-white px-2 h-8 flex items-center rounded mt-1" on:click={claim}>{loading ? '...' : 'Claim'}</button>
    {/if}
  {:else}
    <button class="bg-black text-white px-2 h-8 flex items-center rounded mt-1" on:click={login}>Login</button>
  {/if}
</div>