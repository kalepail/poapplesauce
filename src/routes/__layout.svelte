<script context="module">
  import { handleResponse } from '../helpers/utils'

  /** @type {import('./__types/[slug]').Load} */
  export async function load({ fetch, session }) {
    const acc = await fetch(`${import.meta.env.VITE_HORIZON_URL}/accounts/${session.pubkey}`)
    .then(handleResponse)

    return {
      status: 200,
      props: {
        acc,
        pubkey: session.pubkey,
        poapism: session.poapism,
      }
    }
  }
</script>

<script>
  import "the-new-css-reset/css/reset.css"

  import "../app.css"
  
  import Header from "../components/Header.svelte"
  import { account } from '../store/account'

  export let acc
  export let pubkey
  export let poapism

  account.set(acc)
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