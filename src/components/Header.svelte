<script context="module">
  export let kit;

  export function login(_, k = kit) {
    return k.openModal({
      onWalletSelected: async (option) => {
        k.setWallet(option.id);
        k
          .getPublicKey()
          .then((pubkey) =>
            fetch("/", {
              method: "POST",
              headers: {
                Accept: "application/json",
              },
              body: JSON.stringify({ pubkey, wallet: option.id }),
            }),
          )
          .then(handleResponse)
          .then(() => location.reload());
      },
    });
  }
</script>

<script>
  import { onMount } from "svelte";

  import { handleResponse } from "../helpers/utils";

  export let poapism;
  export let pubkey;
  export let wallet;

  onMount(async () => {
    const {
      StellarWalletsKit,
      FreighterModule,
      xBullModule,
      AlbedoModule,
      WalletNetwork,
      FREIGHTER_ID,
    } = await import("@creit.tech/stellar-wallets-kit").then((pkg) => pkg);

    kit = new StellarWalletsKit({
      network: WalletNetwork[import.meta.env.VITE_STELLAR_NETWORK],
      selectedWalletId: wallet || FREIGHTER_ID,
      modules: [new xBullModule(), new FreighterModule(), new AlbedoModule()],
    });
  });

  function logout() {
    return fetch("/", {
      method: "DELETE",
      headers: {
        Accept: "application/json",
      },
    })
      .then(handleResponse)
      .then(() => location.reload());
  }
</script>

<header class="flex mb-2">
  <h1 class="font-bold">
    <a href="/">
      {poapism}
      <span class="text-xs bg-black text-white rounded-full px-2 py-1"
        >{import.meta.env.VITE_STELLAR_NETWORK}</span
      >
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
