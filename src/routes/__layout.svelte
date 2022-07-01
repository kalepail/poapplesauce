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
    if ($session.pubkey) fetch(`${import.meta.env.VITE_HORIZON_URL}/accounts/${$session.pubkey}`)
    .then(handleResponse)
    .then((res) => account.set(res))
  })
</script>

<svelte:head>
  <title>{poapism}</title>
</svelte:head>

<main class="flex flex-col w-screen h-screen p-2">
  <Header {poapism} {pubkey} />
  <slot />
</main>