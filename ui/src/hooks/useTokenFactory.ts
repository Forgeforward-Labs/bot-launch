import { useReadClient } from "@/lib/useReadClient";
import { abi as TokenFactoryAbi } from "../abis/TokenFactory.json";
import { tokenFactoryAddress } from "@/lib/constants";
import { useWalletClient } from "wagmi";
import { toast } from "sonner";

export const useTokenFactory = () => {
  const readClient = useReadClient();
  const { data: client } = useWalletClient();

  const createTokens = async (
    tokenName: string,
    tokenSymbol: string,
    tokenDecimals: number,
    tokenSupply: number
  ) => {
    try {
      if (!tokenSupply || !tokenDecimals || !tokenSymbol || !tokenName) {
        toast.error("Please fill in all fields");
        return null;
      }

      const { request, result: tokenAddress } =
        await readClient.simulateContract({
          account: client?.account,
          address: tokenFactoryAddress,
          abi: TokenFactoryAbi,
          functionName: "createStandardToken",
          args: [
            tokenName,
            tokenSymbol,
            BigInt(tokenSupply * 10 ** tokenDecimals),
            tokenDecimals,
          ],
        });

      const txHash = await client?.writeContract(request);

      const receipt = await readClient?.waitForTransactionReceipt({
        hash: txHash as `0x${string}`,
      });

      if (receipt?.status === "success") {
        toast.success("Token created successfully");
        return tokenAddress;
      }

      toast.error("Token creation failed");

      return receipt;
    } catch (error) {
      console.error(error);
      toast.error("Token creation failed");
      return null;
    }
  };

  return { createTokens };
};
