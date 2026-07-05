import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useNavigate, useParams } from "react-router-dom";
import { useGetPresaleQuery } from "@/graphql/__generated__/types-and-hooks";
import PresaleProgressBar from "@/components/launchpad/PresaleProgressBar";
import Countdown from "@/components/launchpad/Countdown";
import StatusBadge from "@/components/launchpad/StatusBadge";
import {
  decodeSalesJson,
  computePresaleStatus,
  formatEth,
} from "@/lib/salesJson";
import useSales from "@/hooks/useSales";
import { formatEther } from "viem";

export default function PresaleDetail() {
  const { id: saleAddress } = useParams<{ id: string }>();
  const [contribution, setContribution] = useState("");
  const [activeTab, setActiveTab] = useState("contribute");
  const { address, isConnected } = useAccount();
  const navigate = useNavigate();
  const { buy, finalizeSale, getParticipant, getLiveSaleData } = useSales();

  const { data, loading, error, refetch } = useGetPresaleQuery({
    variables: { saleAddress: saleAddress ?? "" },
    skip: !saleAddress,
    pollInterval: 15000,
  });

  const [participant, setParticipant] = useState<{
    participant: string;
    amount: bigint;
    status: number;
  } | null>(null);
  const [liveSaleSold, setLiveSaleSold] = useState<bigint | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const presaleRaw = data?.Presale?.[0];

  useEffect(() => {
    if (!saleAddress || !address) return;
    getParticipant(saleAddress, address).then((p) => {
      if (p)
        setParticipant(
          p as { participant: string; amount: bigint; status: number },
        );
    });
  }, [saleAddress, address]);

  useEffect(() => {
    if (!saleAddress) return;
    getLiveSaleData(saleAddress).then((d) => {
      if (d) setLiveSaleSold((d as { saleSold: bigint }).saleSold);
    });
  }, [saleAddress]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center text-zinc-500">
        <div className="text-5xl mb-4">⏳</div>
        <div>Loading presale...</div>
      </div>
    );
  }

  if (error || !presaleRaw) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center text-zinc-500">
        <div className="text-5xl mb-4">⚠️</div>
        <div className="text-lg mb-2">Presale not found</div>
        <button
          onClick={() => navigate("/sales")}
          className="text-emerald-400 hover:underline text-sm"
        >
          ← Back to Sales
        </button>
      </div>
    );
  }

  const meta = decodeSalesJson(presaleRaw.salesJson ?? "");
  const startTime = BigInt(presaleRaw.startTime ?? "0");
  const endTime = BigInt(presaleRaw.endTime ?? "0");
  const hardCap = BigInt(presaleRaw.hardCap ?? "0");
  const softCap = BigInt(presaleRaw.softCap ?? "0");
  const maxBuy = BigInt(presaleRaw.maxBuy ?? "0");
  const totalTokensForSale = BigInt(presaleRaw.totalTokensForSale ?? "0");
  const saleSold = liveSaleSold ?? BigInt(presaleRaw.saleSold ?? "0");

  const status = computePresaleStatus(
    startTime,
    endTime,
    saleSold,
    hardCap,
    presaleRaw.status,
  );

  const hardCapEth = parseFloat(formatEth(hardCap, 4));
  const softCapEth = parseFloat(formatEth(softCap, 4));
  const raisedEth = parseFloat(formatEth(saleSold, 4));
  const maxBuyEth = parseFloat(formatEth(maxBuy, 4));
  const liquidityBPS = Number(presaleRaw.liquidityBPS ?? 0);
  const presaleRate =
    hardCap > 0n ? Number(totalTokensForSale) / Number(hardCap) : 0;

  const userContributionWei = participant?.amount ?? 0n;
  const userContributionEth = parseFloat(formatEther(userContributionWei));
  const participantStatus = participant?.status ?? 0; // 0=DEFAULT, 1=CLAIMED, 2=REFUNDED

  const remainingAllocation = Math.max(0, maxBuyEth - userContributionEth);
  const canContribute = status === "live" && isConnected;

  const handleBuy = async () => {
    if (!saleAddress || !contribution) return;
    setIsSubmitting(true);
    try {
      const receipt = await buy(saleAddress, contribution);
      if (receipt) {
        setContribution("");
        // Refresh participant and live data
        if (address) {
          const p = await getParticipant(saleAddress, address);
          if (p)
            setParticipant(
              p as { participant: string; amount: bigint; status: number },
            );
        }
        const d = await getLiveSaleData(saleAddress);
        if (d) setLiveSaleSold((d as { saleSold: bigint }).saleSold);
        refetch();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinalize = async () => {
    if (!saleAddress || !address) return;
    setIsSubmitting(true);
    try {
      await finalizeSale(saleAddress, address);
      refetch();
    } finally {
      setIsSubmitting(false);
    }
  };

  const isOwner = address?.toLowerCase() === presaleRaw.saleOwner.toLowerCase();
  const canFinalize = (status === "ended" || status === "filled") && isOwner;

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-5 md:py-10">
      <button
        onClick={() => navigate("/sales")}
        className="text-zinc-500 hover:text-white text-sm flex items-center gap-2 mb-5 md:mb-8"
      >
        ← Back to Projects
      </button>

      <div className="grid md:grid-cols-[1fr_420px] gap-5 md:gap-10">
        {/* Left Column */}
        <div className="space-y-4 md:space-y-6">
          {/* Header Card */}
          <div className="card-gradient-strong rounded-2xl md:rounded-3xl border border-zinc-800/40 p-5 md:p-8">
            <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 md:gap-0">
              <div className="flex gap-3.5 md:gap-5 items-center">
                <div className="w-14 h-14 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-gradient-to-br from-zinc-800 to-zinc-700 flex items-center justify-center text-3xl md:text-4xl overflow-hidden">
                  {meta?.logoUrl ? (
                    <img
                      src={meta.logoUrl}
                      alt="logo"
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  ) : (
                    "🚀"
                  )}
                </div>
                <div>
                  <h1 className="text-xl md:text-3xl font-bold text-white">
                    {meta?.name ?? `Sale ${saleAddress?.slice(0, 8)}`}
                  </h1>
                  <div className="text-sm md:text-base text-zinc-500 mt-1">
                    {meta?.symbol
                      ? `$${meta.symbol}`
                      : presaleRaw.token.slice(0, 10) + "..."}
                  </div>
                </div>
              </div>
              <StatusBadge status={status} />
            </div>

            <p className="text-sm md:text-base text-zinc-400 leading-relaxed mt-4 md:mt-6 mb-4 md:mb-6">
              {meta?.description ?? "No description provided."}
            </p>

            {meta?.tags && meta.tags.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {meta.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-zinc-800/50 px-3 py-1.5 rounded-lg text-xs text-zinc-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-zinc-800/30 flex gap-4 text-xs text-zinc-500">
              <span>
                Contract:{" "}
                <a
                  href={`https://scan.bohr.life/address/${saleAddress}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-400 hover:underline"
                >
                  {saleAddress?.slice(0, 10)}...
                </a>
              </span>
              {meta?.website && (
                <a
                  href={meta.website}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-400 hover:underline"
                >
                  Website
                </a>
              )}
              {meta?.twitter && (
                <a
                  href={meta.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-400 hover:underline"
                >
                  Twitter
                </a>
              )}
            </div>
          </div>

          {/* Progress Card */}
          <div className="card-gradient-strong rounded-2xl md:rounded-3xl border border-zinc-800/40 p-5 md:p-8">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 md:gap-0 mb-6">
              <h2 className="text-base md:text-lg font-semibold">
                Sale Progress
              </h2>
              <div className="md:text-right">
                <div className="text-[11px] text-zinc-500 mb-1">
                  {status === "live"
                    ? "Ends in"
                    : status === "upcoming"
                      ? "Starts in"
                      : status === "ended" || status === "finalized"
                        ? "Ended"
                        : ""}
                </div>
                {(status === "live" || status === "upcoming") && (
                  <Countdown
                    endTime={
                      status === "live"
                        ? Number(Number(endTime) * 1000)
                        : Number(Number(startTime) * 1000)
                    }
                  />
                )}
              </div>
            </div>

            <PresaleProgressBar value={raisedEth} max={hardCapEth} />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 mt-5 md:mt-7">
              {[
                { label: "Soft Cap", value: `${softCapEth} BOT` },
                { label: "Hard Cap", value: `${hardCapEth} BOT` },
                { label: "Raised", value: `${raisedEth} BOT` },
                {
                  label: "Participants",
                  value: Number(presaleRaw.participantCount ?? 0),
                },
              ].map((item, i) => (
                <div key={i}>
                  <div className="text-[11px] text-zinc-600 mb-1.5">
                    {item.label}
                  </div>
                  <div className="text-sm md:text-base font-semibold">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Token Info Card */}
          <div className="card-gradient-strong rounded-2xl md:rounded-3xl border border-zinc-800/40 p-5 md:p-8">
            <h2 className="text-base md:text-lg font-semibold mb-4 md:mb-6">
              Token Information
            </h2>
            <div className="grid md:grid-cols-2 gap-3 md:gap-5">
              {[
                {
                  label: "Presale Rate",
                  value:
                    presaleRate > 0
                      ? `1 BOT = ${presaleRate.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${meta?.symbol ?? "tokens"}`
                      : "N/A",
                },
                { label: "Max Buy", value: `${maxBuyEth} BOT` },
                { label: "Liquidity %", value: `${liquidityBPS}%` },
                {
                  label: "Token Address",
                  value: presaleRaw.token.slice(0, 14) + "...",
                },
              ].map((item, i) => (
                <div key={i} className="bg-zinc-800/30 rounded-xl p-3.5 md:p-4">
                  <div className="text-[11px] text-zinc-600 mb-2">
                    {item.label}
                  </div>
                  <div className="text-sm font-medium">{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Owner Actions */}
          {isOwner && (
            <div className="card-gradient-strong rounded-2xl md:rounded-3xl border border-zinc-800/40 p-5 md:p-8">
              <h2 className="text-base md:text-lg font-semibold mb-4">
                Owner Actions
              </h2>
              <button
                disabled={!canFinalize || isSubmitting}
                onClick={handleFinalize}
                className={`w-full rounded-xl py-3 text-base font-bold transition-all ${
                  canFinalize && !isSubmitting
                    ? "gradient-btn text-black"
                    : "bg-zinc-800/50 text-zinc-600 cursor-not-allowed"
                }`}
              >
                {isSubmitting
                  ? "Finalizing..."
                  : canFinalize
                    ? "Finalize Sale"
                    : "Sale Not Ended Yet"}
              </button>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-4 md:space-y-6">
          {/* Your Contribution */}
          {isConnected && userContributionEth > 0 && (
            <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/30 rounded-2xl p-4 md:p-5">
              <div className="flex items-center gap-3">
                <span className="text-2xl">✓</span>
                <div>
                  <div className="text-sm font-semibold text-emerald-400">
                    You Contributed
                  </div>
                  <div className="text-xs text-zinc-400 mt-0.5">
                    {userContributionEth.toFixed(4)} BOT
                    {participantStatus === 1 && " · Tokens Claimed"}
                    {participantStatus === 2 && " · Refunded"}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Contribution Panel */}
          <div className="card-gradient-strong rounded-2xl md:rounded-3xl border border-zinc-800/40 p-5 md:p-7">
            <div className="flex gap-2 mb-4 md:mb-6 pb-3 md:pb-4 border-b border-zinc-800/30">
              {["contribute", "claim"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 md:px-5 py-2 md:py-2.5 rounded-lg text-sm font-medium capitalize flex-1 md:flex-none transition-all
                    ${
                      activeTab === tab
                        ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400"
                        : "text-zinc-500 border border-transparent"
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === "contribute" ? (
              <>
                <div className="mb-5">
                  <div className="flex justify-between mb-2.5 text-sm text-zinc-500">
                    <span>Amount (BOT)</span>
                    <span>Max: {remainingAllocation.toFixed(4)} BOT</span>
                  </div>
                  <div className="flex bg-zinc-900/80 rounded-xl border border-zinc-700/50 overflow-hidden">
                    <input
                      type="number"
                      placeholder="0.0"
                      value={contribution}
                      onChange={(e) => setContribution(e.target.value)}
                      disabled={!canContribute || isSubmitting}
                      className="flex-1 bg-transparent px-4 py-4 text-white text-lg font-medium outline-none"
                    />
                    <button
                      onClick={() =>
                        setContribution(remainingAllocation.toString())
                      }
                      disabled={!canContribute}
                      className="bg-emerald-500/10 px-4 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/20 disabled:opacity-50"
                    >
                      MAX
                    </button>
                  </div>
                </div>

                <div className="bg-zinc-800/30 rounded-xl p-4 mb-5">
                  <div className="flex justify-between text-sm text-zinc-400 mb-3">
                    <span>You will receive</span>
                    <span className="text-white font-semibold">
                      {contribution && presaleRate > 0
                        ? (
                            parseFloat(contribution) * presaleRate
                          ).toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                          })
                        : "0"}{" "}
                      {meta?.symbol ?? "tokens"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-zinc-400">
                    <span>Your total contribution</span>
                    <span className="text-white font-semibold">
                      {(
                        userContributionEth + (parseFloat(contribution) || 0)
                      ).toFixed(4)}{" "}
                      BOT
                    </span>
                  </div>
                </div>

                <button
                  disabled={!canContribute || !contribution || isSubmitting}
                  onClick={handleBuy}
                  className={`w-full rounded-xl py-4 text-base font-bold transition-all
                    ${
                      canContribute && contribution && !isSubmitting
                        ? "gradient-btn text-black"
                        : "bg-zinc-800/50 text-zinc-600 cursor-not-allowed"
                    }`}
                >
                  {isSubmitting
                    ? "Processing..."
                    : !isConnected
                      ? "Connect Wallet"
                      : status !== "live"
                        ? "Sale Not Active"
                        : "Contribute"}
                </button>
              </>
            ) : (
              <>
                <div className="bg-zinc-800/30 rounded-xl p-6 text-center mb-5">
                  <div className="text-xs text-zinc-500 mb-2">Your Tokens</div>
                  <div className="text-3xl font-bold gradient-text">
                    {presaleRate > 0
                      ? (userContributionEth * presaleRate).toLocaleString(
                          undefined,
                          { maximumFractionDigits: 2 },
                        )
                      : "0"}{" "}
                    {meta?.symbol ?? "tokens"}
                  </div>
                  <div className="text-xs text-zinc-500 mt-2">
                    {participantStatus === 0
                      ? "Available after finalization"
                      : participantStatus === 1
                        ? "Claimed ✓"
                        : "Refunded"}
                  </div>
                </div>

                <button
                  disabled
                  className="w-full rounded-xl py-4 text-base font-bold bg-zinc-800/50 text-zinc-600 cursor-not-allowed"
                >
                  {status === "finalized"
                    ? "Claim via Contract"
                    : "Claim Available After Finalization"}
                </button>
                <p className="text-xs text-zinc-600 text-center mt-2">
                  Claiming is handled directly via the contract
                </p>
              </>
            )}
          </div>

          {/* Activity Card */}
          <div className="card-gradient-strong rounded-2xl md:rounded-3xl border border-zinc-800/40 p-5 md:p-7">
            <h3 className="text-sm md:text-base font-semibold mb-4 md:mb-5">
              Your Activity
            </h3>
            <div className="space-y-4">
              {[
                {
                  label: "Contributed",
                  value: `${userContributionEth.toFixed(4)} BOT`,
                },
                {
                  label: "Tokens to Receive",
                  value:
                    presaleRate > 0
                      ? `${(userContributionEth * presaleRate).toLocaleString(undefined, { maximumFractionDigits: 2 })} ${meta?.symbol ?? "tokens"}`
                      : "N/A",
                },
                {
                  label: "Remaining Allocation",
                  value: `${remainingAllocation.toFixed(4)} BOT`,
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className={`flex justify-between pb-4 ${i < 2 ? "border-b border-zinc-800/30" : ""}`}
                >
                  <span className="text-zinc-500 text-sm">{item.label}</span>
                  <span className="font-semibold text-sm">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
