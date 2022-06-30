<script>
import { handleResponse } from "../../helpers/utils"

export let poaps
export let origin

let modalShadow
let poapPublicKey
let loading = false

$: addresses = `GCKXWZ4OW4GLT6BLGW7D44KU5KJDUOR4TAKMDZJZKKDPFXUJV7UQDRF7
GA55XQUTPNYZ5JGRFOYWFOTHRU7RNIDUFKPNCV7VI2LBMYML35DGGHG7
GCWXR4XDEQVZGOL5NTFILO7XAWABK7P6I26HVTYS7RGCLZOJTOS2GQJD`

function submit() {
  loading = true

  return fetch('/manage', {
    method: 'POST',
    headers: {
      Accept: 'application/json'
    },
    body: JSON.stringify({
      poapPublicKey,
      addresses: addresses.split('\n')
    })
  })
  .then(handleResponse)
  .then(() => {
    poapPublicKey = null
    addresses = ''
  })
  .finally(() => loading = false)
}
</script>

<h1 class="mb-2">Manage Existing POAPs</h1>

{#if poaps?.length}
  <ul>
    {#each poaps as poap (poap.name)}
      <li class="flex items-start mb-2">
        <img class="mr-2" style:max-width="calc(16px * 4)" src="{origin}/ipfs/{poap.metadata.ipfshash}">
        <div class="flex flex-col items-start">
          <span>{poap.metadata.code}</span>
          <span>{poap.metadata.issuer}</span>

          <div class="flex mt-1">
            <a class="bg-black text-white px-2 h-8 flex items-center rounded mr-2" href="/claim/{poap.name}">Claim Link</a>
            <button class="bg-black text-white px-2 h-8 flex items-center rounded" on:click={() => poapPublicKey = poap.metadata.issuer}>✨🌈</button>
          </div>
        </div>
      </li>
    {/each}
  </ul>
{:else}
  <a class="bg-black text-white px-2 h-8 flex items-center rounded self-start" href="/mint">Mint New POAP</a>
{/if}

{#if poapPublicKey}
  <div class="absolute inset-0 bg-black/75 z-1 flex items-center justify-center" bind:this={modalShadow} on:click={(e) => {if (e.target === modalShadow) poapPublicKey = null}}>
    <form class="min-w-50 max-h-screen bg-white p-2 rounded flex flex-col items-start" on:submit|preventDefault={submit}>
      <h1 class="mb-1">Add addresses the the allowlist for this POAP</h1>
      <p class="text-sm mb-1">Only one address per line</p>
      <textarea class="border border-black w-full rounded p-1 font-mono text-xs mb-2" style:min-height="10rem" name="addresses" bind:value={addresses}></textarea>
      <button class="bg-black text-white px-2 h-8 flex items-center rounded self-end">{loading ? '...' : 'Submit'}</button>
    </form>
  </div>
{/if}