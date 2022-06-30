<script>
  import { session } from '$app/stores'
  import { onMount } from 'svelte'

  import "the-new-css-reset/css/reset.css"

  import "../app.css"

  import poapisms from '../helpers/poap.json'
  import Header from "../components/Header.svelte"
  import { account } from '../store/account'

  let poapism = poapisms[Math.floor(Math.random() * poapisms.length)]

  onMount(async () => {
    const { Server } = await import('stellar-sdk')
    const server = new Server(import.meta.env.VITE_HORIZON_URL)

    if ($session.pubkey) server
    .loadAccount($session.pubkey)
    .then((res) => account.set(res))
  })
</script>

<svelte:head>
  <title>{poapism}</title>
</svelte:head>

<main class="flex flex-col w-screen h-screen p-2">
  <Header {poapism} pubkey={$session.pubkey} />
  <slot />
</main>