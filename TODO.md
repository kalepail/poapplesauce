## Next
- [ ] Redirect toml route to root
- [ ] fully follow [SEP39](https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0039.md) best practices 
  - [ ] issue many nfts from the same address
  - [ ] use [EIP-721](https://eips.ethereum.org/EIPS/eip-721) json vs an image for the `ipfshash`
  - [ ] fill out toml more fully
- [ ] support for a name and description
- [ ] surface errors to the client
- [ ] look at using load for redirects vs window.reload

## Someday
- [ ] Implement [Stytch](https://stytch.com/) for email verification vs Cloudflare Zero Trust
- [ ] List of claimed poaps
- [ ] List of pending poap claims
- [ ] Clawback claimed poaps
- [ ] Delete pending poap claims

- [x] @stellar.org email gateway for minting on PUBLIC
- [x] better error reporting
- [x] Shorter POAP claim link
- [x] support self claims (right now you get bad auth extra)
- [x] call HEAD on ipfs routes before calling get (to save on bandwidth)
- [x] cache ipfs images
- [x] cache toml file
- [x] fill out the README
- [x] Use poap claims KV to block reclaims