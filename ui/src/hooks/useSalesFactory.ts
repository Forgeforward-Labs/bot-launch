import { useWalletClient } from "wagmi";
import { useContractAddresses } from "@/lib/constants";
import salesFactoryAbi from "@/abis/salesFactory";
import { useReadClient } from "@/lib/useReadClient";
import { toast } from "sonner";
import type { SalesJsonMeta } from "@/lib/salesJson";
import { encodeSalesJson } from "@/lib/salesJson";

export interface CreateSaleParams {
  tokenAddress: string;
  tokenDecimals: number;
  tokenSymbol: string;
  tokenName: string;
  tokenTotalSupply: bigint;
  startTime: number; // unix timestamp
  endTime: number;
  softCap: bigint; // in wei
  hardCap: bigint;
  maxBuy: bigint;
  totalTokensForSale: bigint;
  totalTokensForLiquidity: bigint;
  liquidityBPS: number; // 0-100
  meta: SalesJsonMeta;
}

export const useSalesFactory = () => {
  const { data: client } = useWalletClient();
  const readClient = useReadClient();
  const { salesFactory: salesFactoryAddress } = useContractAddresses();

  const createSale = async (params: CreateSaleParams) => {
    if (!client) {
      toast.error("Wallet not connected");
      return;
    }

    const salesJsonBytes = encodeSalesJson(params.meta);
    const totalTokensNeeded =
      params.totalTokensForSale + params.totalTokensForLiquidity;

    try {
      // Approve tokens to be transferred by the factory
      toast.info("Approving tokens for sale creation...");

      const allowanceAbi = [
        {
          inputs: [
            { name: "owner", type: "address" },
            { name: "spender", type: "address" },
          ],
          name: "allowance",
          outputs: [{ name: "", type: "uint256" }],
          stateMutability: "view",
          type: "function",
        },
      ] as const;

      const approveAbi = [
        {
          inputs: [
            { name: "spender", type: "address" },
            { name: "amount", type: "uint256" },
          ],
          name: "approve",
          outputs: [{ name: "", type: "bool" }],
          stateMutability: "nonpayable",
          type: "function",
        },
      ] as const;

      const currentAllowance = (await readClient.readContract({
        address: params.tokenAddress as `0x${string}`,
        abi: allowanceAbi,
        functionName: "allowance",
        args: [client.account.address, salesFactoryAddress as `0x${string}`],
      })) as bigint;

      if (currentAllowance < totalTokensNeeded) {
        const { request: approveRequest } = await readClient.simulateContract({
          address: params.tokenAddress as `0x${string}`,
          abi: approveAbi,
          functionName: "approve",
          args: [salesFactoryAddress as `0x${string}`, totalTokensNeeded],
          account: client.account,
        });

        const approveTx = await client.writeContract(approveRequest);
        await readClient.waitForTransactionReceipt({ hash: approveTx });
        toast.success("Tokens approved");
      }

      toast.info("Creating sale...");

      const { request } = await readClient.simulateContract({
        address: salesFactoryAddress as `0x${string}`,
        abi: salesFactoryAbi,
        functionName: "createSale",
        args: [
          params.tokenAddress as `0x${string}`,
          {
            startTime: BigInt(params.startTime),
            endTime: BigInt(params.endTime),
            softCap: params.softCap,
            hardCap: params.hardCap,
            maxBuy: params.maxBuy,
            saleSold: BigInt(0),
            totalTokensForSale: params.totalTokensForSale,
            salesJson: salesJsonBytes,
            totalTokensForLiquidity: params.totalTokensForLiquidity,
            liquidityBPS: params.liquidityBPS,
          },
          {
            tokenAddress: params.tokenAddress as `0x${string}`,
            tokenDecimals: params.tokenDecimals,
            tokenSymbol: params.tokenSymbol,
            tokenName: params.tokenName,
            tokenTotalSupply: params.tokenTotalSupply,
          },
        ],
        account: client.account,
      });

      const tx = await client.writeContract(request);
      const receipt = await readClient.waitForTransactionReceipt({ hash: tx });

      if (receipt.status === "success") {
        toast.success("Sale created successfully!");
        return receipt;
      }
    } catch (error) {
      console.error("createSale error:", error);
      toast.error("Failed to create sale");
    }
  };

  return { createSale };
};

export default useSalesFactory;
