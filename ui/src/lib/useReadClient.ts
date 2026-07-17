import { createPublicClient, http } from "viem";
import { botChainTestnet, botChainMainnet } from "./chains";
import { useAccount } from "wagmi";

const useReadClient = () => {
  const { chainId } = useAccount();
  const chain = chainId === botChainMainnet.id ? botChainMainnet : botChainTestnet;
  return createPublicClient({
    chain,
    transport: http(chain.rpcUrls.default.http[0]),
  });
};
export { useReadClient };
