<script context="module">
  /** @type {import('./__types/[slug]').Load} */
  export async function load({ url, session }) {
    return {
      status: 200,
      props: {
        poapism: session.poapism,
        origin: url.origin
      }
    }
  }
</script>

<script>
  import "the-new-css-reset/css/reset.css"
  import "../app.css"

  export let poapism
  export let origin
</script>

<svelte:head>
  <title>{poapism}</title>
  <link rel="icon" href="{origin}/favicon.png" />
</svelte:head>

<slot />