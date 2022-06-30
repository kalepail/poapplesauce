<script>
  import albedo from '@albedo-link/intent'
  import { session } from '$app/stores'
  
  import { handleResponse } from '../helpers/utils'

  export let poapism

  function login() {
    return albedo.publicKey()
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
  <h1 class="font-bold"><a href="/">{poapism}</a></h1>

  <div class="ml-auto">
    {#if $session.pubkey}
      <button on:click={logout}>Logout</button>
    {:else}
      <button on:click={login}>Login</button>
    {/if}
  </div>
</header>