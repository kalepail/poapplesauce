<script context="module">
  /** @type {import('./__types/[slug]').Load} */
  export async function load({ url, session }) {
    return {
      status: 200,
      props: {
        pubkey: session.pubkey,
        poapism: session.poapism,
        origin: url.origin
      }
    }
  }
</script>

<script>
  import "the-new-css-reset/css/reset.css"

  import "../app.css"
  
  import Header from "../components/Header.svelte"

  export let pubkey
  export let poapism
  export let origin
</script>

<svelte:head>
  <title>{poapism}</title>
  <link rel="icon" href="{origin}/favicon.png" />
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