<script>
import { session } from '$app/stores'
import { Server } from 'stellar-sdk'

import "the-new-css-reset/css/reset.css"

import "../app.css"

import poapisms from '../helpers/poap.json'
import Header from "../components/Header.svelte"
import { account } from '../store/account'

let poapism = poapisms[Math.floor(Math.random() * poapisms.length)]

const server = new Server(import.meta.env.VITE_HORIZON_URL)

session.subscribe((s) => {
  if (s?.pubkey) server
  .loadAccount(s.pubkey)
  .then((res) => account.set(res))
})
</script>

<svelte:head>
  <title>{poapism}</title>
</svelte:head>

<main class="flex flex-col w-screen h-screen p-2">
  <Header {poapism} />
  <slot />
</main>