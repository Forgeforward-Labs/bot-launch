# Forge

A full-stack token launch platform built natively on **BOT Chain** — token factory, presales with automatic DEX liquidity migration, token/LP locking, and airdrops, all in one non-custodial suite.

🌐 **Live app:** https://bot-launch.vercel.app/
🐦 **X:** [@BOTChain_ai](https://twitter.com/BOTChain_ai)

---

## 🎯 Overview

Forge bundles the four pieces a project needs to go from idea to a liquid market:

- **Token Factory** — deploy standard ERC-20s or fee-on-transfer tokens in one transaction.
- **Launchpad (Presales)** — soft/hard-capped sales with per-wallet limits, optional Merkle-proof whitelisting, and a guaranteed exit: if the soft cap isn't hit by the deadline, contributors can withdraw their BOT directly from the contract — no trusting an admin to process refunds.
- **Auto-Liquidity on Finalize** — a configurable share of the raised BOT and reserved tokens is deposited straight into a BDEX V2 pool the moment a sale finalizes, and the resulting LP token is tracked in an on-chain vault.
- **Locker** — token and LP timelocks with shareable lock certificates, so teams can prove liquidity is actually locked.
- **Airdrop Distributor** — Merkle-based claims for community distributions.

Everything is indexed in real time (Envio) and surfaced through a single React dashboard, so users never have to leave the app to buy into a sale, claim tokens, get refunded, or lock LP.

---

## 📦 Repo Structure

```
.
├── smart-contracts/   # Solidity contracts (Hardhat) — see smart-contracts/README.md
├── indexer/            # Envio HyperIndex indexer + GraphQL API — see indexer/README.md
└── ui/                 # React + TypeScript frontend — see ui/README.md
```

---

## 📋 Contract Addresses — BOT Chain Testnet (chain id `968`)

| Contract | Address |
|---|---|
| TokenFactory | `0x2284Cff73d2384fDF91E84060d40A41581E642Ac` |
| LockFactory | `0x0ff13De01a0Cac7CBe377fFfe3992086A6bC1E72` |
| AirdropDistributor | `0x592B56644ca7adb298Ec373eC10a36f435b9f410` |
| SalesFactory | `0xee438609D158a6406BC237Ebae82fD5c748e2154` |
| LPVault | `0x2ddFE0717b74F7D2af6cBd7513AF4523f30ec048` |

**DEX integration (BDEX V2, used for auto-liquidity on finalize):**

| | Address |
|---|---|
| Factory | `0x65b8e98ceA190d8c28B3e4716402027f634d15a3` |
| Router | `0xD6425a02f0845B8D99e349C34D2E7A576E177345` |
| WBOT | `0xD5452816194a3784dBa983426cCe7c122F4abd30` |

---

## ⚙️ Technical Summary

- **Contracts**: Solidity 0.8.28, Hardhat + Hardhat Ignition, OpenZeppelin (Ownable, ERC20, MerkleProof). Deployed on BOT Chain Testnet.
- **Presale lifecycle** (`Sales.sol`): `buy()` / `buyWithWhitelist()` accumulate contributions against a hard cap; after the deadline, `finalizeSale()` (owner-only, blocked unless soft cap is met) approves and calls the BDEX V2 Router's `addLiquidityETH()` to seed a pool, then registers the pair in `LPVault` for later withdrawal. If the soft cap is missed, `refund()` lets each contributor pull their BOT back directly; `claim()` lets contributors pull their tokens once a successful sale is finalized.
- **Liquidity vault** (`LPVault.sol`): permissionlessly verifies and records the DEX pair address via `factory.getPair()` (no trusted oracle needed), owner-gated LP withdrawal.
- **Indexing**: Envio HyperIndex watches `TokenFactory`, `LockFactory`, `SalesFactory`, and dynamically-tracked `Sales` contracts, exposing a GraphQL API the frontend polls for live sale/lock/airdrop state.
- **Frontend**: React + TypeScript + Vite, wagmi/viem for wallet + contract calls, Tailwind for styling.

See [`smart-contracts/README.md`](smart-contracts/README.md), [`indexer/README.md`](indexer/README.md), and [`ui/README.md`](ui/README.md) for setup and development instructions for each package.

---

## 🗺️ Roadmap

**Shipped**
- Token Factory (standard + fee tokens)
- Presale engine with whitelist, soft-cap refunds, and automatic DEX liquidity migration
- Token/LP locker with certificates
- Airdrop distributor
- Live indexer + UI on BOT Chain Testnet

**Next**
- Third-party security audit before mainnet
- Vesting schedules / cliffs for locked tokens (beyond flat timelocks)
- Anti-bot / anti-snipe protections for sale launches
- Multi-pool liquidity support as BOT Chain's DEX ecosystem grows
- **Voting platform** — token holders vote on proposals for their project's launch (e.g. early unlocks or extensions of locked tokens/LP), giving communities a say over decisions that were previously owner-only
- Analytics dashboard for project creators (holder growth, LP health, vesting unlocks)
- Mainnet launch + cross-chain presale support

---

## 🐦 Announcement

> 🔥 Introducing Forge — a full-stack launchpad built on @BOTChain_ai
>
> Token Factory, presales with auto DEX liquidity + LP lock, token/LP locking, and airdrops — all on-chain, all permissionless.
>
> Try it: https://bot-launch.vercel.app/
>
> Our submission for the BOT Chain hackathon 🛠️
>
> #BOTChain #Web3 #DeFi
