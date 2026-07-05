import { useReadClient } from "@/lib/useReadClient";
import standardTokenAbi from "@/abis/StandardToken";
import { useAccount, useWalletClient } from "wagmi";
import { toast } from "sonner";

export const useERC20Token = (address: string) => {
  const readClient = useReadClient();
  const { data: client } = useWalletClient();
  const { address: account } = useAccount();

  const getTokenDetails = async () => {
    const [name, symbol, decimals, totalSupply] = await Promise.all([
      // =new await readClient.readContract({
      readClient.readContract({
        address: address as `0x${string}`,
        abi: standardTokenAbi,
        functionName: "name",
      }),
      readClient.readContract({
        address: address as `0x${string}`,
        abi: standardTokenAbi,
        functionName: "symbol",
      }),
      readClient.readContract({
        address: address as `0x${string}`,
        abi: standardTokenAbi,
        functionName: "decimals",
      }),
      readClient.readContract({
        address: address as `0x${string}`,
        abi: standardTokenAbi,
        functionName: "totalSupply",
      }),
    ]);

    return { name, symbol, decimals, totalSupply };
  };

  const getTokenBalance = async (address: `0x${string}`) => {
    const balance = await readClient.readContract({
      address: address as `0x${string}`,
      abi: standardTokenAbi,
      functionName: "balanceOf",
      args: [address],
    });

    return balance;
  };

  const getTokenAllowance = async (
    owner: `0x${string}`,
    spender: `0x${string}`
  ) => {
    const allowance = await readClient.readContract({
      address: address as `0x${string}`,
      abi: standardTokenAbi,
      functionName: "allowance",
      args: [owner, spender],
    });

    return allowance;
  };

  const getTokenOwnership = async () => {
    const owner = await readClient.readContract({
      address: address as `0x${string}`,
      abi: standardTokenAbi,
      functionName: "owner",
    });

    if (!owner) {
      return null;
    }

    return owner as `0x${string}`;
  };

  const transferOwnership = async (newOwner: `0x${string}`) => {
    try {
      if (!newOwner) {
        toast.error("Error", {
          description: "Please enter a valid address",
        });
        return;
      }

      if (!client) return;
      const { request } = await readClient.simulateContract({
        account: account,
        address: address as `0x${string}`,
        abi: standardTokenAbi,
        functionName: "transferOwnership",
        args: [newOwner],
      });

      const tx = await client.writeContract(request);

      const receipt = await readClient.waitForTransactionReceipt({
        hash: tx as `0x${string}`,
      });

      if (receipt?.status === "success") {
        toast.success("Ownership transferred successfully");
      } else {
        throw new Error("Failed to transfer ownership");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to transfer ownership");
      throw new Error("Failed to transfer ownership");
    }
  };

  const approve = async (spender: `0x${string}`, amount: bigint) => {
    try {
      if (!client) return;
      const { request } = await readClient.simulateContract({
        account: account,
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

  const renounceOwnership = async () => {
    try {
      if (!client) return;
      const { request } = await readClient.simulateContract({
        account: account,
        address: address as `0x${string}`,
        abi: standardTokenAbi,
        functionName: "renounceOwnership",
      });

      const tx = await client.writeContract(request);

      const receipt = await readClient.waitForTransactionReceipt({
        hash: tx as `0x${string}`,
      });

      if (receipt?.status === "success") {
        toast.success("Ownership renounced successfully");
      } else {
        toast.success("Ownership renounced successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to renounce ownership");
      throw new Error("Failed to renounce ownership");
    }
  };

  const getTokenApproval = async (spender: `0x${string}`) => {
    try {
      const approval = await readClient.readContract({
        address: address as `0x${string}`,
        abi: standardTokenAbi,
        functionName: "allowance",
        args: [account, spender],
      });

      return approval as bigint;
    } catch (error) {
      console.error(error);
      toast.error("Failed to get token approval");
      return 0n;
    }
  };

  return {
    getTokenOwnership,
    transferOwnership,
    renounceOwnership,
    getTokenDetails,
    getTokenBalance,
    getTokenAllowance,
    approve,
    getTokenApproval,
  };
};
