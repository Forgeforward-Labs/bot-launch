import { useReadClient } from "@/lib/useReadClient";
import airdropAbi from "../abis/airdropDistributor";
import { airdropDistributorAddress } from "@/lib/constants";
import { useWalletClient } from "wagmi";
import { toast } from "sonner";
import standardTokenAbi from "@/abis/StandardToken";

export const useAirdrop = () => {
  const readClient = useReadClient();
  const { data: client } = useWalletClient();

  const getTokenApproval = async (
    address: `0x${string}`,
    spender: `0x${string}`
  ) => {
    try {
      const approval = await readClient.readContract({
        address: address as `0x${string}`,
        abi: standardTokenAbi,
        functionName: "allowance",
        args: [address, spender],
      });

      return approval as bigint;
    } catch (error) {
      console.error(error);
      toast.error("Failed to get token approval");
      return 0n;
    }
  };

  const approve = async (
    address: `0x${string}`,
    spender: `0x${string}`,
    amount: bigint
  ) => {
    try {
      if (!client) return;
      const { request } = await readClient.simulateContract({
        account: client?.account,
        address: address as `0x${string}`,
        abi: standardTokenAbi,
        functionName: "approve",
        args: [spender, amount],
      });

      const tx = await client.writeContract(request);

      const receipt = await readClient.waitForTransactionReceipt({
        hash: tx as `0x${string}`,
      });

      if (receipt?.status === "success") {
        toast.success("Token approval successful");
        return receipt;
      } else {
        throw new Error("Failed to approve tokens");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to approve tokens");
      throw new Error("Failed to approve tokens");
    }
  };

  const distributeEther = async (recipients: string[], amountEach: bigint) => {
    try {
      if (!recipients.length) {
        toast.error("No recipients provided");
        return null;
      }

      if (amountEach <= 0n) {
        toast.error("Amount must be greater than zero");
        return null;
      }

      const totalValue = amountEach * BigInt(recipients.length);

      const { request } = await readClient.simulateContract({
        account: client?.account,
        address: airdropDistributorAddress,
        abi: airdropAbi,
        functionName: "distributeEther",
        args: [recipients, amountEach],
        value: totalValue,
      });

      const txHash = await client?.writeContract(request);

      const receipt = await readClient?.waitForTransactionReceipt({
        hash: txHash as `0x${string}`,
      });

      if (receipt?.status === "success") {
        toast.success("ETH distributed successfully");
        return receipt;
      }

      toast.error("ETH distribution failed");
      return receipt;
    } catch (error) {
      console.error(error);
      toast.error("ETH distribution failed");
      return null;
    }
  };

  const distributeEtherAllocation = async (
    recipients: string[],
    values: bigint[]
  ) => {
    try {
      if (!recipients.length) {
        toast.error("No recipients provided");
        return null;
      }

      if (recipients.length !== values.length) {
        toast.error("Recipients and values arrays must have the same length");
        return null;
      }

      const totalValue = values.reduce((sum, value) => sum + value, 0n);

      const { request } = await readClient.simulateContract({
        account: client?.account,
        address: airdropDistributorAddress,
        abi: airdropAbi,
        functionName: "distributeEtherAllocation",
        args: [recipients, values],
        value: totalValue,
      });

      const txHash = await client?.writeContract(request);

      const receipt = await readClient?.waitForTransactionReceipt({
        hash: txHash as `0x${string}`,
      });

      if (receipt?.status === "success") {
        toast.success("ETH allocation distributed successfully");
        return receipt;
      }

      toast.error("ETH allocation distribution failed");
      return receipt;
    } catch (error) {
      console.error(error);
      toast.error("ETH allocation distribution failed");
      return null;
    }
  };

  const distributeToken = async (
    tokenAddress: string,
    recipients: string[],
    amountEach: bigint
  ) => {
    try {
      if (!recipients.length) {
        toast.error("No recipients provided");
        return null;
      }

      if (amountEach <= 0n) {
        toast.error("Amount must be greater than zero");
        return null;
      }

      const approval = await getTokenApproval(
        tokenAddress as `0x${string}`,
        airdropDistributorAddress as `0x${string}`
      );
      if (approval < amountEach * BigInt(recipients.length)) {
        await approve(
          tokenAddress as `0x${string}`,
          airdropDistributorAddress as `0x${string}`,
          amountEach * BigInt(recipients.length)
        );
      }

      const { request } = await readClient.simulateContract({
        account: client?.account,
        address: airdropDistributorAddress,
        abi: airdropAbi,
        functionName: "distributeToken",
        args: [tokenAddress, recipients, amountEach],
      });

      const txHash = await client?.writeContract(request);

      const receipt = await readClient?.waitForTransactionReceipt({
        hash: txHash as `0x${string}`,
      });

      if (receipt?.status === "success") {
        toast.success("Tokens distributed successfully");
        return receipt;
      }

      toast.error("Token distribution failed");
      return receipt;
    } catch (error) {
      console.error(error);
      toast.error("Token distribution failed");
      return null;
    }
  };

  const distributeTokenAllocation = async (
    tokenAddress: string,
    recipients: string[],
    values: bigint[]
  ) => {
    try {
      if (!recipients.length) {
        toast.error("No recipients provided");
        return null;
      }

      if (recipients.length !== values.length) {
        toast.error("Recipients and values arrays must have the same length");
        return null;
      }

      const totalValue = values.reduce((sum, value) => sum + value, 0n);

      const approval = await getTokenApproval(
        tokenAddress as `0x${string}`,
        airdropDistributorAddress as `0x${string}`
      );
      if (approval < totalValue) {
        await approve(
          tokenAddress as `0x${string}`,
          airdropDistributorAddress as `0x${string}`,
          totalValue
        );
      }

      const { request } = await readClient.simulateContract({
        account: client?.account,
        address: airdropDistributorAddress,
        abi: airdropAbi,
        functionName: "distributeTokenAllocation",
        args: [tokenAddress, recipients, values],
      });

      const txHash = await client?.writeContract(request);

      const receipt = await readClient?.waitForTransactionReceipt({
        hash: txHash as `0x${string}`,
      });

      if (receipt?.status === "success") {
        toast.success("Token allocation distributed successfully");
        return receipt;
      }

      toast.error("Token allocation distribution failed");
      return receipt;
    } catch (error) {
      console.error(error);
      toast.error("Token allocation distribution failed");
      return null;
    }
  };

  return {
    distributeEther,
    distributeEtherAllocation,
    distributeToken,
    distributeTokenAllocation,
  };
};
