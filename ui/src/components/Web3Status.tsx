import { Copy, Loader2, LayoutDashboard, LogOut, AlertTriangle, ChevronDown, FlaskConical, Globe } from "lucide-react";
import { useAccount, useDisconnect } from "wagmi";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ConnectButton } from "./ConnectButton";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { toast } from "sonner";
import { botChainTestnet, botChainMainnet, isBotChain } from "@/lib/chains";

const CHAIN_PARAMS = {
  [botChainTestnet.id]: {
    chainId: `0x${botChainTestnet.id.toString(16)}`,
    chainName: botChainTestnet.name,
    nativeCurrency: botChainTestnet.nativeCurrency,
    rpcUrls: botChainTestnet.rpcUrls.default.http,
    blockExplorerUrls: [botChainTestnet.blockExplorers.default.url],
  },
  [botChainMainnet.id]: {
    chainId: `0x${botChainMainnet.id.toString(16)}`,
    chainName: botChainMainnet.name,
    nativeCurrency: botChainMainnet.nativeCurrency,
    rpcUrls: botChainMainnet.rpcUrls.default.http,
    blockExplorerUrls: [botChainMainnet.blockExplorers.default.url],
  },
};

const switchToChain = async (chainId: number) => {
  if (!window.ethereum) return;
  const params = CHAIN_PARAMS[chainId as keyof typeof CHAIN_PARAMS];
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: params.chainId }],
    });
  } catch (err: any) {
    if (err?.code === 4902 || err?.code === -32603) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [params],
      });
    } else {
      throw err;
    }
  }
};

export const Web3Status = () => {
  const { isConnected, address, isConnecting, chainId } = useAccount();
  const { disconnect } = useDisconnect();
  const [isSwitching, setIsSwitching] = useState(false);
  const [networkOpen, setNetworkOpen] = useState(false);

  const onBotChain = isBotChain(chainId);
  const isTestnet = chainId === botChainTestnet.id;

  const handleSwitchChain = async (targetChainId: number) => {
    setIsSwitching(true);
    setNetworkOpen(false);
    try {
      await switchToChain(targetChainId);
    } catch {
      toast.error("Failed to switch network");
    } finally {
      setIsSwitching(false);
    }
  };

  if (isConnecting) {
    return (
      <Button variant="gradient" className="flex items-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin" />
        Connecting...
      </Button>
    );
  }

  if (!isConnected) {
    return <ConnectButton />;
  }

  if (!onBotChain) {
    return (
      <Popover open={networkOpen} onOpenChange={setNetworkOpen}>
        <PopoverTrigger asChild>
          <Button variant="destructive" size="sm" className="flex items-center gap-2" disabled={isSwitching}>
            {isSwitching ? <Loader2 className="w-4 h-4 animate-spin" /> : <AlertTriangle className="w-4 h-4" />}
            {isSwitching ? "Switching..." : "Wrong Network"}
            <ChevronDown className="w-3 h-3" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-44 p-1 border border-zinc-700/50 bg-[#0d0d12]">
          <p className="text-xs text-zinc-500 px-2 py-1.5">Switch to</p>
          <button
            onClick={() => handleSwitchChain(botChainMainnet.id)}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800/60 rounded transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            BOT Chain
          </button>
          <button
            onClick={() => handleSwitchChain(botChainTestnet.id)}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800/60 rounded transition-colors"
          >
            <FlaskConical className="w-3.5 h-3.5 text-amber-400" />
            BOT Testnet
          </button>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {/* Network selector */}
      <Popover open={networkOpen} onOpenChange={setNetworkOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1.5 h-9 px-2.5 text-xs border-zinc-700/60"
            disabled={isSwitching}
          >
            {isSwitching ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : isTestnet ? (
              <FlaskConical className="w-3 h-3 text-amber-400" />
            ) : (
              <Globe className="w-3 h-3 text-emerald-400" />
            )}
            {isSwitching ? "Switching..." : isTestnet ? "Testnet" : "Mainnet"}
            <ChevronDown className="w-3 h-3 text-zinc-500" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-44 p-1 border border-zinc-700/50 bg-[#0d0d12]">
          <button
            onClick={() => handleSwitchChain(botChainMainnet.id)}
            className={`flex items-center gap-2 w-full px-3 py-2 text-sm rounded transition-colors ${
              !isTestnet
                ? "text-white bg-zinc-800/60"
                : "text-zinc-300 hover:text-white hover:bg-zinc-800/60"
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            BOT Chain
            {!isTestnet && <span className="ml-auto text-xs text-emerald-400">✓</span>}
          </button>
          <button
            onClick={() => handleSwitchChain(botChainTestnet.id)}
            className={`flex items-center gap-2 w-full px-3 py-2 text-sm rounded transition-colors ${
              isTestnet
                ? "text-white bg-zinc-800/60"
                : "text-zinc-300 hover:text-white hover:bg-zinc-800/60"
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5 text-amber-400" />
            BOT Testnet
            {isTestnet && <span className="ml-auto text-xs text-amber-400">✓</span>}
          </button>
        </PopoverContent>
      </Popover>

      {/* Wallet button */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-0 overflow-hidden border border-zinc-700/50 bg-[#0d0d12]">
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

          <div className="py-1.5">
            <Link
              to="/portfolio"
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800/60 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-emerald-400" />
              Portfolio
            </Link>
          </div>

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
    </div>
  );
};
