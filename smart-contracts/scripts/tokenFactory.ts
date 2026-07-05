import { network } from "hardhat";

const { viem } = await network.connect({
  network: "botChainTestnet",
});

const publicClient = await viem.getPublicClient();

const [senderClient] = await viem.getWalletClients();
const { address } = senderClient.account;

console.log("Sending 1 wei from", address, "to itself");

const l1Gas = await publicClient.estimateGas({
  account: address,
  to: address,
  value: 1n,
});

console.log("Estimated L1 gas:", l1Gas);
