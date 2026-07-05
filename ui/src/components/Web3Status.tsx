import { Copy, Loader2, LayoutDashboard, LogOut, AlertTriangle } from "lucide-react";
import { useAccount, useDisconnect } from "wagmi";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ConnectButton } from "./ConnectButton";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { toast } from "sonner";
import { botChainTestnet } from "@/lib/chains";

const BOT_CHAIN_PARAMS = {
  chainId: `0x${botChainTestnet.id.toString(16)}`,
  chainName: botChainTestnet.name,
  nativeCurrency: botChainTestnet.nativeCurrency,
  rpcUrls: botChainTestnet.rpcUrls.default.http,
  blockExplorerUrls: [botChainTestnet.blockExplorers.default.url],
};

export const Web3Status = () => {
  const { isConnected, address, isConnecting, chainId } = useAccount();
  const { disconnect } = useDisconnect();
  const [isSwitching, setIsSwitching] = useState(false);

  const isWrongChain = isConnected && chainId !== botChainTestnet.id;

  const handleSwitchChain = async () => {
    if (!window.ethereum) return;
    setIsSwitching(true);
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: BOT_CHAIN_PARAMS.chainId }],
      });
    } catch (err: any) {
      // 4902 = chain not added to wallet yet
      if (err?.code === 4902 || err?.code === -32603) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [BOT_CHAIN_PARAMS],
          });
        } catch {
          toast.error("Failed to add BOT Chain to wallet");
        }
      } else {
        toast.error("Failed to switch chain");
      }
    } finally {
      setIsSwitching(false);
    }
  };

  return (
    <div>
      {isConnecting ? (
        <Button variant="gradient" className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 mr-2 animate-spin group-hover:animate-pulse" />
          Connecting...
        </Button>
      ) : isWrongChain ? (
        <Button
          variant="destructive"
          size="sm"
          className="flex items-center gap-2"
          onClick={handleSwitchChain}
          disabled={isSwitching}
        >
          {isSwitching ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <AlertTriangle className="w-4 h-4" />
          )}
          {isSwitching ? "Switching..." : "Switch to BOT Chain"}
        </Button>
      ) : isConnected ? (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-0 overflow-hidden border border-zinc-700/50 bg-[#0d0d12]">
            {/* Address header */}
            <div className="px-4 py-3 border-b border-zinc-700/30 bg-zinc-900/40">
              <p className="text-xs text-zinc-500 mb-1">Connected wallet</p>
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-mono text-zinc-200">
                  {address?.slice(0, 10)}...{address?.slice(-6)}
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(address || "");
                    toast("Copied to clipboard");
                  }}
                  className="text-zinc-500 hover:text-emerald-400 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Menu items */}
            <div className="py-1.5">
              <Link
                to="/portfolio"
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800/60 transition-colors"
              >
                <LayoutDashboard className="w-4 h-4 text-emerald-400" />
                Portfolio
              </Link>
            </div>

            {/* Disconnect */}
            <div className="border-t border-zinc-700/30 py-1.5">
              <button
                onClick={() => disconnect()}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-zinc-400 hover:text-red-400 hover:bg-red-500/5 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Disconnect
              </button>
            </div>
          </PopoverContent>
        </Popover>
      ) : (
        <ConnectButton />
      )}
    </div>
  );
};
