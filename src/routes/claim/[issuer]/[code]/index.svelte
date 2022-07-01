<script>
  import { onMount } from "svelte";

  import { handleResponse } from "../../../../helpers/utils"
  import { account } from '../../../../store/account'
  import { login } from '../../../../components/Header.svelte'

  export let pubkey
  export let issuer
  export let code
  export let poap
  export let origin

  let albedo
  let loading = false
  let claimed = false

  onMount(async () => {
    albedo = await import('@albedo-link/intent').then((pkg) => pkg.default)
  })

  account.subscribe((a) => {
    if (a?.balances?.length) claimed = a.balances.findIndex(({asset_issuer, asset_code}) => 
      asset_issuer === poap.metadata.issuer 
      && asset_code === poap.metadata.code
    ) > -1
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