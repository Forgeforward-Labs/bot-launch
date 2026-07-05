import { createPublicClient, http } from "viem";
import { botChainTestnet } from "./chains";

const useReadClient = () => {
  return createPublicClient({
    chain: botChainTestnet,
    transport: http(botChainTestnet.rpcUrls.default.http[0]),
  });
};
export { useReadClient };
