<script>
  import albedo from '@albedo-link/intent'

  import { handleResponse } from "../../helpers/utils";

  export let pubkey

  let loading = false

  $: code = 'NFT'
  $: ipfshash = 'bafkreih6y2dzkizcqbw7piirjvmrolomtuszt6wrg4l5rr56o4ivxcikxy'

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
        description: `Create new ${code} POAP`,
        submit: false
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
  <label class="mb-2">
    Code
    <input class="border border-black rounded px-1" type="text" name="code" bind:value={code}>
  </label>

  <label class="mb-2">
    IPFS Hash
    <input class="border border-black rounded px-1" type="text" name="ipfshash" bind:value={ipfshash}>
  </label>

  {#if ipfshash}
    <img class="mb-2" style:max-width="calc(16px * 4)" src="https://ipfs.io/ipfs/{ipfshash}">
  {/if}

  <button class="bg-black text-white px-2 h-8 flex items-center rounded disabled:bg-gray-400" disabled={!code || !ipfshash}>{loading ? '...' : 'Mint'}</button>
</form>