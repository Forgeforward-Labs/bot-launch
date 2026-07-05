import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { config } from "./lib/wagmi.ts";
import { BrowserRouter } from "react-router-dom";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

// import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
// import { RainbowKitProvider } from "@rainbow-me/rainbowkit";

const queryClient = new QueryClient();

const client = new ApolloClient({
  uri: import.meta.env.VITE_GRAPHQL_URL || "http://localhost:8080/v1/graphql",
  cache: new InMemoryCache(),
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ApolloProvider client={client}>
          {/* <RainbowKitProvider> */}
          <BrowserRouter>
            {/* <Toaster /> */}
            <Sonner />
            <App />
          </BrowserRouter>
        </ApolloProvider>
        {/* </RainbowKitProvider> */}
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>
);
