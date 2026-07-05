import { createConfig } from "wagmi";
import { injected, metaMask } from "wagmi/connectors";
import { http } from "wagmi";
import { botChainTestnet } from "./chains";

export const config = createConfig({
  chains: [botChainTestnet],
  connectors: [injected(), metaMask()],
  transports: {
    [botChainTestnet.id]: http(),
  },
});
