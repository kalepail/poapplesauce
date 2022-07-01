<script>
  import { session } from '$app/stores'
  import { onMount } from 'svelte'

  import "the-new-css-reset/css/reset.css"

  import "../app.css"
  
  import Header from "../components/Header.svelte"
  import { account } from '../store/account'
  import { handleResponse } from '../helpers/utils';

  let pubkey = $session.pubkey
  let poapism = $session.poapism

  onMount(() => {
    if ($session.pubkey) return fetch(`${import.meta.env.VITE_HORIZON_URL}/accounts/${$session.pubkey}`)
    .then(handleResponse)
    .then((res) => account.set(res))
    .catch((err) => console.error(err))
  })
</script>

<svelte:head>
  <title>{poapism}</title>
</svelte:head>

<main class="flex flex-col w-screen p-2">
  <Header {poapism} {pubkey} />
  <slot />
</main>

<style>
  main {
    min-height: 100vh;
    min-height: -moz-available;
    min-height: -webkit-fill-available;
    min-height: stretch;
  }
</style>