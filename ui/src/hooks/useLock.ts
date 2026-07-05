import { useReadClient } from "@/lib/useReadClient";
import lockAbi from "../abis/TokenLock";
import { useWalletClient } from "wagmi";

export const useLock = () => {
  const readClient = useReadClient();
  const { data: client } = useWalletClient();

  const withdraw = async (lockAddress: string) => {
    try {
      const { request } = await readClient.simulateContract({
        account: client?.account,
        address: lockAddress as `0x${string}`,
        abi: lockAbi,
        functionName: "withdraw",
      });

      const tx = await client?.writeContract(request);

      const receipt = await readClient.waitForTransactionReceipt({
        hash: tx as `0x${string}`,
      });

      return receipt;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return { withdraw };
};
