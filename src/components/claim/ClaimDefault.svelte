<script>
  import Header from "../Header.svelte";

  export let albedo
  export let loading

  export let poapism
  export let pubkey
  export let issuer
  export let code
  export let poap
  export let origin
  export let claimed

  export let claim
  export let login
</script>

<main class="flex flex-col w-screen p-2">
  <Header {poapism} {pubkey} />

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
</main>

<style>
  main {
    min-height: 100vh;
    min-height: -moz-available;
    min-height: -webkit-fill-available;
    min-height: stretch;
  }
</style>