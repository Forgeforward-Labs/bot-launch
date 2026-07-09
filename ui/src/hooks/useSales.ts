import { useWalletClient } from "wagmi";
import salesContractAbi from "@/abis/salesContract";
import { useReadClient } from "@/lib/useReadClient";
import { toast } from "sonner";
import { parseEther, keccak256, encodePacked, getAddress, isAddress } from "viem";

export const useSales = () => {
  const { data: client } = useWalletClient();
  const readClient = useReadClient();

  const buy = async (saleAddress: string, ethAmount: string) => {
    if (!client) {
      toast.error("Wallet not connected");
      return;
    }

    try {
      const amountWei = parseEther(ethAmount);

      const { request } = await readClient.simulateContract({
        address: saleAddress as `0x${string}`,
        abi: salesContractAbi,
        functionName: "buy",
        args: [amountWei],
        value: amountWei,
        account: client.account,
      });

      toast.info("Submitting purchase...");
      const tx = await client.writeContract(request);
      const receipt = await readClient.waitForTransactionReceipt({ hash: tx });

      if (receipt.status === "success") {
        toast.success("Purchase successful!");
        return receipt;
      }
    } catch (error) {
      console.error("buy error:", error);
      toast.error("Purchase failed");
    }
  };

  const finalizeSale = async (saleAddress: string, casher: string) => {
    if (!client) {
      toast.error("Wallet not connected");
      return;
    }

    try {
      const { request } = await readClient.simulateContract({
        address: saleAddress as `0x${string}`,
        abi: salesContractAbi,
        functionName: "finalizeSale",
        args: [casher as `0x${string}`],
        account: client.account,
      });

      toast.info("Finalizing sale...");
      const tx = await client.writeContract(request);
      const receipt = await readClient.waitForTransactionReceipt({ hash: tx });

      if (receipt.status === "success") {
        toast.success("Sale finalized!");
        return receipt;
      }
    } catch (error) {
      console.error("finalizeSale error:", error);
      toast.error("Failed to finalize sale");
    }
  };

  const claim = async (saleAddress: string) => {
    if (!client) {
      toast.error("Wallet not connected");
      return;
    }

    try {
      const { request } = await readClient.simulateContract({
        address: saleAddress as `0x${string}`,
        abi: salesContractAbi,
        functionName: "claim",
        account: client.account,
      });

      toast.info("Claiming tokens...");
      const tx = await client.writeContract(request);
      const receipt = await readClient.waitForTransactionReceipt({ hash: tx });

      if (receipt.status === "success") {
        toast.success("Tokens claimed!");
        return receipt;
      }
    } catch (error) {
      console.error("claim error:", error);
      toast.error("Failed to claim tokens");
    }
  };

  const refund = async (saleAddress: string) => {
    if (!client) {
      toast.error("Wallet not connected");
      return;
    }

    try {
      const { request } = await readClient.simulateContract({
        address: saleAddress as `0x${string}`,
        abi: salesContractAbi,
        functionName: "refund",
        account: client.account,
      });

      toast.info("Requesting refund...");
      const tx = await client.writeContract(request);
      const receipt = await readClient.waitForTransactionReceipt({ hash: tx });

      if (receipt.status === "success") {
        toast.success("Refund sent!");
        return receipt;
      }
    } catch (error) {
      console.error("refund error:", error);
      toast.error("Failed to get refund");
    }
  };

  const getParticipant = async (saleAddress: string, participant: string) => {
    try {
      const result = await readClient.readContract({
        address: saleAddress as `0x${string}`,
        abi: salesContractAbi,
        functionName: "getParticipant",
        args: [participant as `0x${string}`],
      });
      return result;
    } catch (error) {
      console.error("getParticipant error:", error);
      return null;
    }
  };

  const getLiveSaleData = async (saleAddress: string) => {
    try {
      const result = await readClient.readContract({
        address: saleAddress as `0x${string}`,
        abi: salesContractAbi,
        functionName: "getSaleData",
      });
      return result;
    } catch (error) {
      console.error("getSaleData error:", error);
      return null;
    }
  };

  const getTokenData = async (saleAddress: string) => {
    try {
      const result = await readClient.readContract({
        address: saleAddress as `0x${string}`,
        abi: salesContractAbi,
        functionName: "tokenData",
      });
      return result;
    } catch (error) {
      console.error("getTokenData error:", error);
      return null;
    }
  };

  const updateWhitelist = async (saleAddress: string, addresses: string[]) => {
    if (!client) {
      toast.error("Wallet not connected");
      return;
    }

    const validAddresses = addresses.filter((a) => isAddress(a));
    if (validAddresses.length === 0) {
      toast.error("No valid addresses provided");
      return;
    }

    // Compute Merkle root: leaf = keccak256(abi.encodePacked(address))
    let nodes: `0x${string}`[] = validAddresses
      .map((a) => keccak256(encodePacked(["address"], [getAddress(a)])))
      .sort();

    while (nodes.length > 1) {
      const next: `0x${string}`[] = [];
      for (let i = 0; i < nodes.length; i += 2) {
        if (i + 1 >= nodes.length) {
          next.push(nodes[i]);
        } else {
          const [a, b] =
            nodes[i] < nodes[i + 1]
              ? [nodes[i], nodes[i + 1]]
              : [nodes[i + 1], nodes[i]];
          next.push(keccak256(`0x${a.slice(2)}${b.slice(2)}` as `0x${string}`));
        }
      }
      nodes = next;
    }
    const root = nodes[0];

    try {
      // Set whitelist duration: start now, 365 days
      const nowSec = BigInt(Math.floor(Date.now() / 1000));
      const { request: req1 } = await readClient.simulateContract({
        address: saleAddress as `0x${string}`,
        abi: salesContractAbi,
        functionName: "setWhitelistDuration",
        args: [nowSec, 365],
        account: client.account,
      });
      toast.info("Setting whitelist period...");
      const tx1 = await client.writeContract(req1);
      await readClient.waitForTransactionReceipt({ hash: tx1 });

      // Set whitelist root
      const { request: req2 } = await readClient.simulateContract({
        address: saleAddress as `0x${string}`,
        abi: salesContractAbi,
        functionName: "setWhitelist",
        args: [root],
        account: client.account,
      });
      toast.info("Setting whitelist merkle root...");
      const tx2 = await client.writeContract(req2);
      const receipt = await readClient.waitForTransactionReceipt({ hash: tx2 });

      if (receipt.status === "success") {
        toast.success(`Whitelist updated with ${validAddresses.length} addresses`);
        return receipt;
      }
    } catch (error) {
      console.error("updateWhitelist error:", error);
      toast.error("Failed to update whitelist");
    }
  };

  return {
    buy,
    finalizeSale,
    claim,
    refund,
    getParticipant,
    getLiveSaleData,
    getTokenData,
    updateWhitelist,
  };
};

export default useSales;
