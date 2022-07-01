<script context="module">
  import { login } from '../components/Header.svelte'
</script>

<script>
  export let pubkey
</script>

{#if pubkey}
  <div class="flex m-auto">
    <a class="bg-black text-white mx-1 px-2 h-8 flex items-center rounded" href="/manage">Manage Existing POAPs</a>
    <a class="bg-black text-white mx-1 px-2 h-8 flex items-center rounded" href="/mint">Mint New POAP</a>
  </div>
{:else}
  <button class="bg-black text-white m-auto px-2 h-8 flex items-center rounded" on:click={login}>Login</button>
{/if}