## Next
- [ ] view pending claimable POAPs
- [ ] redirect toml route to root
- [ ] surface errors to the client
- [ ] implement [SEP-14](https://discord.com/channels/763798356484161566/772838189920026635/991365076781109288) to remove the need for wildcard toml files
- [ ] fully follow [SEP-39](https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0039.md) best practices 
  - [ ] issue many nfts from the same address
  - [ ] use [EIP-721](https://eips.ethereum.org/EIPS/eip-721) json vs an image for the `ipfshash`
  - [ ] fill out toml more fully
- [ ] support for a name and description
- [ ] look at using load for redirects vs window.reload

## Someday
- [ ] implement [Stytch](https://stytch.com/) for email verification vs Cloudflare Zero Trust
- [ ] list of claimed poaps
- [ ] list of pending poap claims
- [ ] clawback claimed poaps
- [ ] delete pending poap claims

## Done
- [x] @stellar.org email gateway for minting on PUBLIC
- [x] better error reporting
- [x] shorter POAP claim link
- [x] support self claims (right now you get bad auth extra)
- [x] call HEAD on ipfs routes before calling get (to save on bandwidth)
- [x] cache ipfs images
- [x] cache toml file
- [x] use poap claims KV to block reclaims
- [x] fill out the README
