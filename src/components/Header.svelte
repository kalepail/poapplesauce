<script context="module">
  let albedo

  export function login(_, a = albedo) {
    return a.publicKey()
    .then((res) => fetch('/', {
      method: 'POST',
      headers: {
        Accept: 'application/json'
      },
      body: JSON.stringify(res)
    }))
    .then(handleResponse)
    .then(() => location.reload())
  }
</script>

<script>
  import { onMount } from 'svelte'
  
  import { handleResponse } from '../helpers/utils'

  export let poapism
  export let pubkey

  onMount(async () => {
    albedo = await import('@albedo-link/intent').then((pkg) => pkg.default)
  })
  
  function logout() {
    return fetch('/', {
      method: 'DELETE',
      headers: {
        Accept: 'application/json'
      },
    })
    .then(handleResponse)
    .then(() => location.reload())
  }
</script>

<header class="flex mb-2">
  <h1 class="font-bold">
    <a href="/">
      {poapism}
      <span class="text-xs bg-black text-white rounded-full px-2 py-1">{import.meta.env.VITE_STELLAR_NETWORK}</span>
    </a>
  </h1>

  <div class="ml-auto">
    {#if pubkey}
      <button on:click={logout}>Logout</button>
    {:else}
      <button on:click={login}>Login</button>
    {/if}
  </div>
</header>