import { useWalletClient } from "wagmi";
import { lockFactoryAddress } from "@/lib/constants";
import abi from "../abis/lockFactory";
import { useReadClient } from "@/lib/useReadClient";
import { zeroAddress } from "viem";
import { toast } from "sonner";

export const useLockFactory = () => {
  const { data: client } = useWalletClient();
  const readClient = useReadClient();

  //   address _token,
  //         address _owner,
  //         uint256 _lockingAmount,
  //         uint256 _lockTimeEnd,
  //         string memory _projectImageUrl

  const createLock = async ({
    token,
    amount,
    lockTimeEnd,
    decimals,
  }: {
    token: string;
    amount: number;
    lockTimeEnd: number;
    decimals: number;
  }) => {
    const amountInWei = BigInt(amount * 10 ** decimals);

    try {
      // For ERC20 tokens, we need to approve the factory contract first
      if (token !== zeroAddress) {
        // Check current allowance using readClient directly
        const currentAllowance = (await readClient.readContract({
          address: token as `0x${string}`,
          abi: [
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
          ],
          functionName: "allowance",
          args: [
            client?.account.address as `0x${string}`,
            lockFactoryAddress as `0x${string}`,
          ],
        })) as bigint;

        // If allowance is insufficient, approve the factory
        if (currentAllowance < amountInWei) {
          toast.info("Approving tokens for lock creation...");

          const { request: approveRequest } = await readClient.simulateContract(
            {
              address: token as `0x${string}`,
              abi: [
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
              ],
              functionName: "approve",
              args: [lockFactoryAddress as `0x${string}`, amountInWei],
              account: client?.account,
            }
          );

          const approveTx = await client?.writeContract(approveRequest);
          await readClient?.waitForTransactionReceipt({
            hash: approveTx as `0x${string}`,
          });
        }
      }

      const { request } = await readClient.simulateContract({
        address: lockFactoryAddress,
        abi,
        functionName: "createLock",
        args: [
          token,
          client?.account.address,
          amountInWei,
          BigInt(lockTimeEnd),
          "https://sominia.io/images/sominia.png",
        ],
        account: client?.account,
        value: token === zeroAddress ? amountInWei : BigInt(0),
      });

      console.log("request", request);

      const tx = await client?.writeContract(request);

      const receipt = await readClient?.waitForTransactionReceipt({
        hash: tx as `0x${string}`,
      });

      if (receipt?.status === "success") {
        toast.success("Lock created successfully!");
        return receipt;
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  return {
    createLock,
  };
};

export default useLockFactory;
