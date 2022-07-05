<script>
  import { dev } from '$app/env'
  import { onMount } from "svelte";

  import { handleResponse } from "@/helpers/utils";

  export let pubkey
  export let origin

  let albedo
  let loading = false

  $: code = dev ? 'NFT' : ''
  $: ipfshash = dev ? 'bafkreih6y2dzkizcqbw7piirjvmrolomtuszt6wrg4l5rr56o4ivxcikxy' : ''

  onMount(async () => {
    albedo = await import('@albedo-link/intent').then((pkg) => pkg.default)
  })

  function submit() {
    loading = true

    return fetch('/mint', {
      method: 'POST',
      headers: {
        Accept: 'application/json'
      },
      body: JSON.stringify({
        code,
        ipfshash
      })
    })
    .then(handleResponse)
    .then((xdr) => 
      albedo.tx({
        xdr,
        pubkey: pubkey,
        network: import.meta.env.VITE_STELLAR_NETWORK,
        description: `Create new ${code} POAP`
      })
    )
    .then((res) => fetch('/mint/xdr', {
      method: 'POST',
      body: JSON.stringify(res)
    }))
    .then(handleResponse)
    .then(() => {
      code = ''
      ipfshash = ''
    })
    .finally(() => loading = false)
  }
</script>

<h1 class="mb-2">Mint New POAP</h1>

<form class="flex flex-col items-start" on:submit|preventDefault={submit}>
  <label class="mb-2 flex items-center">
    Code
    <input class="border border-black rounded px-1 mx-1" type="text" name="code" bind:value={code}>
    <span class="text-xs">Max {origin.indexOf('.testnet.') > -1 ? 5 : 12} characters</span>
  </label>

  <label class="mb-2">
    IPFS Hash
    <input class="border border-black rounded px-1" type="text" name="ipfshash" bind:value={ipfshash}>
  </label>

  {#if ipfshash}
    <img class="mb-2" style:max-width="calc(16px * 4)" src="{origin}/ipfs/{ipfshash}">
  {/if}

  <button class="bg-black text-white px-2 h-8 flex items-center rounded disabled:bg-gray-400" disabled={!code || !ipfshash}>{loading ? '...' : 'Mint'}</button>
</form>