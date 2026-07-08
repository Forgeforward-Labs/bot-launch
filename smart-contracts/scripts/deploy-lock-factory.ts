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
const LockFactoryArtifact = JSON.parse(
  readFileSync(join(__dirname, "../artifacts/contracts/lockFactory/Factory.sol/LockFactory.json"), "utf8")
);

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

console.log("Deployer:", account.address);
console.log("\nDeploying LockFactory...");

const hash = await walletClient.deployContract({
  abi: LockFactoryArtifact.abi,
  bytecode: LockFactoryArtifact.bytecode as `0x${string}`,
  args: [],
  ...gasParams,
});

console.log("  tx:", hash);
const receipt = await publicClient.waitForTransactionReceipt({ hash });
console.log("  LockFactory deployed at:", receipt.contractAddress);
console.log("\nUpdate ui/src/lib/constants.ts and indexer/config.yaml with this address.");
