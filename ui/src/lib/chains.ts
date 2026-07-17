import { defineChain } from "viem";

export const botChainTestnet = defineChain({
  id: 968,
  name: "BOT Chain Testnet",
  nativeCurrency: {
    name: "BOT",
    symbol: "BOT",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.bohr.life"],
    },
  },
  blockExplorers: {
    default: {
      name: "BOT Chain Explorer",
      url: "https://scan.bohr.life",
    },
  },
  testnet: true,
});

export const botChainMainnet = defineChain({
  id: 677,
  name: "BOT Chain",
  nativeCurrency: {
    name: "BOT",
    symbol: "BOT",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.botchain.ai"],
    },
  },
  blockExplorers: {
    default: {
      name: "BOT Chain Explorer",
      url: "https://scan.botchain.ai",
    },
  },
});

export const BOT_CHAINS = [botChainTestnet, botChainMainnet] as const;
export type BotChainId = (typeof BOT_CHAINS)[number]["id"];

export const isBotChain = (chainId?: number): chainId is BotChainId =>
  BOT_CHAINS.some((c) => c.id === chainId);
