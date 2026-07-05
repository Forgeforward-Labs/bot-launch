import type { HardhatUserConfig } from "hardhat/config";

import hardhatToolboxViemPlugin from "@nomicfoundation/hardhat-toolbox-viem";
import { configVariable } from "hardhat/config";
import hardhatVerify from "@nomicfoundation/hardhat-verify";

import dotenv from "dotenv";
dotenv.config();

const config: HardhatUserConfig = {
  plugins: [hardhatToolboxViemPlugin, hardhatVerify],
  solidity: {
    profiles: {
      default: {
        compilers: [
          {
            version: "0.5.16",
            settings: {
              optimizer: {
                enabled: true,
                runs: 200,
              },
            },
          },
          { version: "0.6.6" },
          { version: "0.4.18" },
          { version: "0.8.28" },
        ],
      },
    },
  },
  networks: {
    hardhatMainnet: {
      type: "edr-simulated",
      chainType: "l1",
    },
    hardhatOp: {
      type: "edr-simulated",
      chainType: "op",
    },
    sepolia: {
      type: "http",
      chainType: "l1",
      url: configVariable("SEPOLIA_RPC_URL"),
      accounts: [configVariable("SEPOLIA_PRIVATE_KEY")],
    },
    botChainTestnet: {
      type: "http",
      chainType: "l1",
      url: process.env.BOT_CHAIN_TESTNET_RPC_URL as string,
      accounts: [process.env.BOT_CHAIN_TESTNET_PRIVATE_KEY as string],
      gas: "auto",
      gasPrice: 100000000000,
    },
  },
  verify: {
    etherscan: {
      // enabled: true,
      apiKey: "empty",
    },
    blockscout: {
      enabled: true,
    },
  },
  chainDescriptors: {
    968: {
      name: "botChainTestnet",
      blockExplorers: {
        blockscout: {
          url: "https://scan.bohr.life",
          apiUrl: "https://scan.bohr.life/api",
        },
      },
    },
  },
};

export default config;
