import {
  createWalletClient,
  createPublicClient,
  http,
  defineChain,
  parseGwei,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const read = (path: string) =>
  JSON.parse(readFileSync(join(__dirname, path), "utf8"));

const TokenFactoryArtifact = read("../artifacts/contracts/tokenFactory/Factory.sol/TokenFactory.json");
const LockFactoryArtifact = read("../artifacts/contracts/lockFactory/Factory.sol/LockFactory.json");
const LPVaultArtifact = read("../artifacts/contracts/launchpad/LPVault.sol/LPVault.json");
const SalesFactoryArtifact = read("../artifacts/contracts/launchpad/SalesFactory.sol/SalesFactory.json");

const botChainMainnet = defineChain({
  id: 677,
  name: "BOT Chain",
  nativeCurrency: { name: "BOT", symbol: "BOT", decimals: 18 },
  rpcUrls: { default: { http: ["https://rpc.botchain.ai"] } },
});

const privateKey = process.env.BOT_CHAIN_MAINNET_PRIVATE_KEY as `0x${string}`;
const account = privateKeyToAccount(privateKey);

const publicClient = createPublicClient({
  chain: botChainMainnet,
  transport: http(),
});

const walletClient = createWalletClient({
  account,
  chain: botChainMainnet,
  transport: http(),
});

const gasParams = {
  gasPrice: parseGwei("60"),
};

async function deployContract(name: string, abi: any, bytecode: `0x${string}`, args: any[] = []) {
  console.log(`\nDeploying ${name}...`);
  const hash = await walletClient.deployContract({ abi, bytecode, args, ...gasParams });
  console.log(`  tx: ${hash}`);
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  console.log(`  ${name} deployed at: ${receipt.contractAddress}`);
  return receipt.contractAddress!;
}

console.log("Network:  BOT Chain Mainnet (677)");
console.log("Deployer:", account.address);

const tokenFactoryAddress = await deployContract(
  "TokenFactory",
  TokenFactoryArtifact.abi,
  TokenFactoryArtifact.bytecode as `0x${string}`
);

const lockFactoryAddress = await deployContract(
  "LockFactory",
  LockFactoryArtifact.abi,
  LockFactoryArtifact.bytecode as `0x${string}`
);

const lpVaultAddress = await deployContract(
  "LPVault",
  LPVaultArtifact.abi,
  LPVaultArtifact.bytecode as `0x${string}`,
  [account.address]
);

const salesFactoryAddress = await deployContract(
  "SalesFactory",
  SalesFactoryArtifact.abi,
  SalesFactoryArtifact.bytecode as `0x${string}`,
  [account.address, lpVaultAddress]
);

console.log("\n=== MAINNET DEPLOYMENT SUMMARY ===");
console.log("Network:      BOT Chain Mainnet (677)");
console.log("Deployer:    ", account.address);
console.log("TokenFactory:", tokenFactoryAddress);
console.log("LockFactory: ", lockFactoryAddress);
console.log("LPVault:     ", lpVaultAddress);
console.log("SalesFactory:", salesFactoryAddress);
console.log("==================================");
