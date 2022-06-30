<script>
  export let pubkey
</script>

{#if pubkey}
  <div class="flex justify-center h-full">
    <div class="flex mt-auto mb-auto">
      <a class="bg-black text-white mx-1 px-2 h-8 flex items-center rounded" href="/manage">Manage Existing POAPs</a>
      <a class="bg-black text-white mx-1 px-2 h-8 flex items-center rounded" href="/mint">Mint New POAP</a>
    </div>
  </div>
{/if}