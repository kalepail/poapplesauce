<script>
  import { login } from '@/components/Header.svelte'

  export let loading

  export let poapism
  export let pubkey
  export let wallet
  export let issuer
  export let code
  export let poap
  export let origin
  export let claimed

  export let claim
</script>

<main class="flex flex-col w-screen p-2 place-content-center text-white">
  <header class="fixed z-0 top-0 p-12" style:left="50%" style:transform="translate(-50%, 0)" style:width="100%" style:max-width="1440px">
    <h1>
      <a class="flex items-center" href="/">
        <img class="mr-2" src="/stellar-wordmark.svg">
        <span class="text-xs bg-white text-black rounded-full px-2 py-1">{import.meta.env.VITE_STELLAR_NETWORK}</span>
      </a>
    </h1>
  
    <!-- <div class="ml-auto">
      {#if pubkey}
        <button on:click={logout}>Logout</button>
      {:else}
        <button on:click={login}>Login</button>
      {/if}
    </div> -->
  </header>

  <img class="fixed z-0 p-6" style:left="50%" style:top="50%" style:transform="translate(-50%, -50%)" src="/star-ring.svg">

  <div class="relative z-1 flex flex-col items-center self-center">
    <h1 class="text-center" style:line-height="1.2em" style:font-size="40px" style:font-weight="400">Claim Your <br> Stellar Ranger NFT</h1>
    <img class="mt-10" style:max-width="calc(16px * 6)" style:box-shadow="0 0 0 1rem black, 0 0 0 1.3rem white" src="{origin}/ipfs/{poap.metadata.ipfshash}">
  
    <div class="mt-16">
      {#if pubkey}
        {#if claimed}
          <span class="h-12 px-6 flex justify-center items-center" style:background-color="#3E1BDB">✔ &nbsp; Claimed</span>
        {:else}
          <button class="h-12 px-6 flex justify-center items-center" style:min-width="300px" style:background-color="#3E1BDB" on:click={claim}>
            {loading ? '...' : 'Claim Now!'}
          </button>
        {/if}
      {:else}
        <button class="h-12 px-6 flex justify-center items-center" style:background-color="#3E1BDB" on:click={login}>Login</button>
      {/if}
    </div>
  </div>
</main>

<style>
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans&display=swap');

  main {
    min-height: 100vh;
    min-height: -moz-available;
    min-height: -webkit-fill-available;
    min-height: stretch;
    background: linear-gradient(247.46deg, #181818 0%, #000000 100%);
    font-family: 'IBM Plex Sans', sans-serif;
  }
</style>