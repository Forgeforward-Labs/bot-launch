import { createConfig } from "wagmi";
import { injected, metaMask } from "wagmi/connectors";
import { http } from "wagmi";
import { botChainTestnet, botChainMainnet } from "./chains";

export const config = createConfig({
  chains: [botChainTestnet, botChainMainnet],
  connectors: [injected(), metaMask()],
  transports: {
    [botChainTestnet.id]: http(),
    [botChainMainnet.id]: http(),
  },
});
