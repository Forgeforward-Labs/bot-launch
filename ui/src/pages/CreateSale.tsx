import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import { parseEther, parseUnits } from "viem";
import { Rocket, Search, ChevronRight, Info } from "lucide-react";
import { toast } from "sonner";
import { useERC20Token } from "@/hooks/useERC20Token";
import { useSalesFactory } from "@/hooks/useSalesFactory";

interface TokenInfo {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: bigint;
}

const CreateSale = () => {
  const navigate = useNavigate();
  const { isConnected } = useAccount();

  // Token lookup
  const [tokenAddress, setTokenAddress] = useState("");
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [loadingToken, setLoadingToken] = useState(false);

  // Sale params
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [softCap, setSoftCap] = useState("");
  const [hardCap, setHardCap] = useState("");
  const [maxBuy, setMaxBuy] = useState("");
  const [tokensForSale, setTokensForSale] = useState("");
  const [tokensForLiquidity, setTokensForLiquidity] = useState("");
  const [liquidityPercent, setLiquidityPercent] = useState("50");

  // Metadata
  const [projectName, setProjectName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [description, setDescription] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [website, setWebsite] = useState("");
  const [twitter, setTwitter] = useState("");
  const [tags, setTags] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const { getTokenDetails } = useERC20Token(tokenAddress);
  const { createSale } = useSalesFactory();

  const handleFetchToken = async () => {
    if (!tokenAddress || !tokenAddress.startsWith("0x")) {
      toast.error("Enter a valid token address");
      return;
    }
    setLoadingToken(true);
    try {
      const details = await getTokenDetails();
      const info: TokenInfo = {
        name: details.name as string,
        symbol: details.symbol as string,
        decimals: details.decimals as number,
        totalSupply: details.totalSupply as bigint,
      };
      setTokenInfo(info);
      setProjectName(info.name);
      setSymbol(info.symbol);
      toast.success(`Token loaded: ${info.name} (${info.symbol})`);
    } catch {
      toast.error("Failed to fetch token details. Check the address.");
    } finally {
      setLoadingToken(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected) {
      toast.error("Connect your wallet first");
      return;
    }
    if (!tokenInfo) {
      toast.error("Fetch token details first");
      return;
    }
    if (!startDate || !endDate) {
      toast.error("Set start and end dates");
      return;
    }

    const startTs = Math.floor(new Date(startDate).getTime() / 1000);
    const endTs = Math.floor(new Date(endDate).getTime() / 1000);

    if (endTs <= startTs) {
      toast.error("End date must be after start date");
      return;
    }
    if (
      !softCap ||
      !hardCap ||
      !maxBuy ||
      !tokensForSale ||
      !tokensForLiquidity
    ) {
      toast.error("Fill in all sale parameters");
      return;
    }

    const softCapWei = parseEther(softCap);
    const hardCapWei = parseEther(hardCap);
    const maxBuyWei = parseEther(maxBuy);

    if (softCapWei >= hardCapWei) {
      toast.error("Hard cap must be greater than soft cap");
      return;
    }
    if (maxBuyWei > hardCapWei) {
      toast.error("Max buy cannot exceed hard cap");
      return;
    }

    const tokensForSaleParsed = parseUnits(tokensForSale, tokenInfo.decimals);
    const tokensForLiquidityParsed = parseUnits(
      tokensForLiquidity,
      tokenInfo.decimals,
    );
    const liqBPS = parseInt(liquidityPercent);
    if (isNaN(liqBPS) || liqBPS < 0 || liqBPS > 100) {
      toast.error("Liquidity % must be between 0 and 100");
      return;
    }

    setSubmitting(true);

    console.log("Total tokens:", tokensForSaleParsed);
    try {
      const receipt = await createSale({
        tokenAddress,
        tokenDecimals: tokenInfo.decimals,
        tokenSymbol: tokenInfo.symbol,
        tokenName: tokenInfo.name,
        tokenTotalSupply: tokenInfo.totalSupply,
        startTime: startTs,
        endTime: endTs,
        softCap: softCapWei,
        hardCap: hardCapWei,
        maxBuy: maxBuyWei,
        totalTokensForSale: tokensForSaleParsed,
        totalTokensForLiquidity: tokensForLiquidityParsed,
        liquidityBPS: liqBPS,
        meta: {
          name: projectName || tokenInfo.name,
          symbol: symbol || tokenInfo.symbol,
          description,
          logoUrl: logoUrl || undefined,
          website: website || undefined,
          twitter: twitter || undefined,
          tags: tags
            ? tags
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean)
            : undefined,
        },
      });

      if (receipt) {
        navigate("/sales");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full bg-zinc-800/60 border border-zinc-700/50 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/60 transition-colors";

  const labelClass = "block text-sm text-zinc-400 mb-1.5";

  return (
    <div className="min-h-screen bg-zinc-950">
      <main className="pt-20 pb-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-3">
              <span className="bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">
                Create a Sale
              </span>
            </h1>
            <p className="text-zinc-400">
              Launch your token presale on Sominia Network
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Token */}
            <div className="bg-gradient-to-br from-zinc-900/90 to-zinc-900/50 rounded-2xl border border-zinc-700/40 p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center text-xs font-bold">
                  1
                </span>
                Token
              </h2>

              <label className={labelClass}>Token Contract Address</label>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="0x..."
                  value={tokenAddress}
                  onChange={(e) => {
                    setTokenAddress(e.target.value);
                    setTokenInfo(null);
                  }}
                  className={inputClass + " flex-1"}
                />
                <button
                  type="button"
                  onClick={handleFetchToken}
                  disabled={loadingToken}
                  className="px-4 py-3 bg-zinc-700 hover:bg-zinc-600 text-white rounded-xl transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <Search className="w-4 h-4" />
                  {loadingToken ? "Loading..." : "Fetch"}
                </button>
              </div>

              {tokenInfo && (
                <div className="mt-4 p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/30 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-zinc-500">Name</p>
                    <p className="text-white font-medium">{tokenInfo.name}</p>
                  </div>
                  <div>
                    <p className="text-zinc-500">Symbol</p>
                    <p className="text-white font-medium">{tokenInfo.symbol}</p>
                  </div>
                  <div>
                    <p className="text-zinc-500">Decimals</p>
                    <p className="text-white font-medium">
                      {tokenInfo.decimals}
                    </p>
                  </div>
                  <div>
                    <p className="text-zinc-500">Total Supply</p>
                    <p className="text-white font-medium">
                      {(
                        Number(tokenInfo.totalSupply) /
                        10 ** tokenInfo.decimals
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Sale Parameters */}
            <div className="bg-gradient-to-br from-zinc-900/90 to-zinc-900/50 rounded-2xl border border-zinc-700/40 p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center text-xs font-bold">
                  2
                </span>
                Sale Parameters
              </h2>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className={labelClass}>Start Date & Time</label>
                  <input
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}>End Date & Time</label>
                  <input
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className={labelClass}>Soft Cap (BOT)</label>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    placeholder="e.g. 10"
                    value={softCap}
                    onChange={(e) => setSoftCap(e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}>Hard Cap (BOT)</label>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    placeholder="e.g. 100"
                    value={hardCap}
                    onChange={(e) => setHardCap(e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className={labelClass}>Max Buy per Wallet (BOT)</label>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    placeholder="e.g. 5"
                    value={maxBuy}
                    onChange={(e) => setMaxBuy(e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}>
                    Tokens For Sale
                    {tokenInfo && (
                      <span className="text-zinc-600 ml-1">
                        ({tokenInfo.symbol})
                      </span>
                    )}
                  </label>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    placeholder="e.g. 1000000"
                    value={tokensForSale}
                    onChange={(e) => setTokensForSale(e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>
                  Tokens For Liquidity
                  {tokenInfo && (
                    <span className="text-zinc-600 ml-1">
                      ({tokenInfo.symbol})
                    </span>
                  )}
                </label>
                <input
                  type="number"
                  step="any"
                  min="0"
                  placeholder="e.g. 1000000"
                  value={tokensForLiquidity}
                  onChange={(e) => setTokensForLiquidity(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className={labelClass}>
                  Liquidity %
                  <span className="text-zinc-600 ml-1">
                    (tokens added to DEX after finalization)
                  </span>
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={liquidityPercent}
                    onChange={(e) => setLiquidityPercent(e.target.value)}
                    className="flex-1 accent-emerald-400"
                  />
                  <span className="text-white font-semibold w-12 text-right">
                    {liquidityPercent}%
                  </span>
                </div>
              </div>

              {softCap && hardCap && tokensForSale && tokenInfo && (
                <div className="mt-4 p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl text-sm text-emerald-300 flex gap-2">
                  <Info className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    Rate: ~
                    {(parseFloat(tokensForSale) / parseFloat(hardCap)).toFixed(
                      4,
                    )}{" "}
                    {tokenInfo.symbol} per BOT at hard cap. You need to approve{" "}
                    {(
                      parseFloat(tokensForSale) + parseFloat(tokensForLiquidity)
                    ).toLocaleString()}{" "}
                    {tokenInfo.symbol} total.
                  </span>
                </div>
              )}
            </div>

            {/* Metadata */}
            <div className="bg-gradient-to-br from-zinc-900/90 to-zinc-900/50 rounded-2xl border border-zinc-700/40 p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center text-xs font-bold">
                  3
                </span>
                Project Details
              </h2>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className={labelClass}>Project Name</label>
                  <input
                    type="text"
                    placeholder="My Token Project"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}>Symbol</label>
                  <input
                    type="text"
                    placeholder="MTK"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className={labelClass}>Description</label>
                <textarea
                  placeholder="Describe your project..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className={inputClass + " resize-none"}
                  required
                />
              </div>

              <div className="mb-4">
                <label className={labelClass}>
                  Logo URL <span className="text-zinc-600">(optional)</span>
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className={labelClass}>
                    Website <span className="text-zinc-600">(optional)</span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>
                    Twitter <span className="text-zinc-600">(optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="@handle"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>
                  Tags{" "}
                  <span className="text-zinc-600">
                    (optional, comma-separated)
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="defi, gaming, nft"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => navigate("/sales")}
                className="flex-1 py-3 rounded-xl border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || !tokenInfo || !isConnected}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-500 text-black font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  "Creating..."
                ) : (
                  <>
                    <Rocket className="w-4 h-4" />
                    Create Sale
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {!isConnected && (
              <p className="text-center text-sm text-zinc-500">
                Connect your wallet to create a sale
              </p>
            )}
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateSale;
