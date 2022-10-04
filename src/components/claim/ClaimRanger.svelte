<script>
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

<main class="flex flex-col w-screen p-2 place-content-center text-white">
  <img class="fixed z-0" style:left="50%" style:top="50%" style:transform="translate(-50%, -50%)" src="/star-ring.svg">

  <div class="relative z-1 flex flex-col items-center self-center">
    <h1 class="text-center" style:line-height="1.2em" style:font-size="40px" style:font-weight="400">Claim Your <br> Stellar Ranger NFT</h1>
    <img class="mt-6" style:max-width="calc(16px * 6)" src="{origin}/ipfs/{poap.metadata.ipfshash}">
  
    <div class="mt-14">
      {#if pubkey}
        {#if claimed}
          <span class="h-12 px-6 flex justify-center items-center" style:background-color="#3E1BDB">Claimed</span>
        {:else}
          <button class="h-12 px-6 flex justify-center items-center" style:min-width="300px" style:background-color="#3E1BDB" on:click={claim}>
            {loading ? '...' : 'Claim Now!'}
          </button>
        {/if}
      {:else}
        <button class="h-12 px-6 flex justify-center items-center" style:background-color="#3E1BDB" on:click={login(albedo)}>Login</button>
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