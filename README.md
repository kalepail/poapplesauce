# Poapplesauce
- [PUBLIC Site](https://poapplesauce.com) (must have an @stellar.org email to create POAPs)
- [TESTNET Site](https://testnet.poapplesauce.com)

https://user-images.githubusercontent.com/4383610/176968498-37f39a88-98a6-4654-a46b-dd808c47fa0a.mov

## Development
1. Rename `.env.development.local.example` -> `.env.development.local`
2. Edit `SIGNER_SK` and `SIGNER_PK` with your own signer keypair
3. `pnpm i`
4. `pnpm start`

## Production
1. Edit `wrangler.toml` filling in with your own variables (including your own KV for both PUBLIC and TESTNET environments)
2. Publish the `SIGNER_SK` counterpart of the `SIGNER_PK` as a secret variable to your cf worker
3. `pnpm run deploy:dev` (TESTNET)
4. `pnpm run deploy` (PUBLIC)