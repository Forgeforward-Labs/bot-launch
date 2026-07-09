import {
  createWalletClient,
  createPublicClient,
  http,
  defineChain,
  parseGwei,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import dotenv from "dotenv";
dotenv.config();
import LPVaultArtifact from "../artifacts/contracts/launchpad/LPVault.sol/LPVault.json" assert { type: "json" };
import SalesFactoryArtifact from "../artifacts/contracts/launchpad/SalesFactory.sol/SalesFactory.json" assert { type: "json" };

const botChainTestnet = defineChain({
  id: 968,
  name: "BOT Chain Testnet",
  nativeCurrency: { name: "BOT", symbol: "BOT", decimals: 18 },
  rpcUrls: { default: { http: ["https://rpc.bohr.life"] } },
});

const privateKey = process.env.BOT_CHAIN_TESTNET_PRIVATE_KEY as `0x${string}`;
const account = privateKeyToAccount(privateKey);

const publicClient = createPublicClient({
  chain: botChainTestnet,
  transport: http(),
});

const walletClient = createWalletClient({
  account,
  chain: botChainTestnet,
  transport: http(),
});

const gasParams = {
  maxFeePerGas: parseGwei("100"),
  maxPriorityFeePerGas: parseGwei("50"),
};

async function deployContract(name: string, abi: any, bytecode: `0x${string}`, args: any[] = []) {
  console.log(`\nDeploying ${name}...`);
  const hash = await walletClient.deployContract({
    abi,
    bytecode,
    args,
    ...gasParams,
  });
  console.log(`  tx: ${hash}`);
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  console.log(`  ${name} deployed at: ${receipt.contractAddress}`);
  return receipt.contractAddress!;
}

console.log("Deployer:", account.address);

const lpVaultAddress = await deployContract(
  "LPVault",
  LPVaultArtifact.abi,
  LPVaultArtifact.bytecode as `0x${string}`,
  [account.address]
);

const treasury = account.address;
const salesFactoryAddress = await deployContract(
  "SalesFactory",
  SalesFactoryArtifact.abi,
  SalesFactoryArtifact.bytecode as `0x${string}`,
  [treasury, lpVaultAddress]
);

console.log("\n=== DEPLOYMENT SUMMARY ===");
console.log("Network:      BOT Chain Testnet (968)");
console.log("Deployer:    ", account.address);
console.log("LPVault:     ", lpVaultAddress);
console.log("SalesFactory:", salesFactoryAddress);
console.log("==========================");
