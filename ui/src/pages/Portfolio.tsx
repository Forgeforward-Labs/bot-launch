import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useNavigate } from "react-router-dom";
import { formatEther } from "viem";
import {
  useGetUserPresalePurchasesQuery,
  useGetAllPresalesQuery,
} from "@/graphql/__generated__/types-and-hooks";
import { decodeSalesJson, computePresaleStatus } from "@/lib/salesJson";
import StatusBadge from "@/components/launchpad/StatusBadge";
import useSales from "@/hooks/useSales";

interface ContributionItem {
  saleAddress: string;
  name: string;
  symbol: string;
  logo: string;
  saleStatus: string;
  contributed: number;
  estimatedTokens: number;
  participantStatus: number; // 0=DEFAULT, 1=CLAIMED, 2=REFUNDED
}

export default function PortfolioView() {
  const { address, isConnected } = useAccount();
  const navigate = useNavigate();
  const { getParticipant } = useSales();

  const { data: purchasesData, loading: purchasesLoading } =
    useGetUserPresalePurchasesQuery({
      variables: { buyer: address ?? "" },
      skip: !address,
      pollInterval: 30000,
    });

  const { data: presalesData, loading: presalesLoading } =
    useGetAllPresalesQuery({ pollInterval: 30000 });

  const [participantStatuses, setParticipantStatuses] = useState<
    Record<string, number>
  >({});

  const purchases = purchasesData?.PresalePurchase ?? [];
  const presales = presalesData?.Presale ?? [];

  // Group purchases by saleAddress and sum contributed amounts
  const saleContributions: Record<string, number> = {};
  for (const p of purchases) {
    const eth = parseFloat(formatEther(BigInt(p.ethAmount)));
    saleContributions[p.saleAddress] =
      (saleContributions[p.saleAddress] ?? 0) + eth;
  }

  const uniqueSaleAddresses = Object.keys(saleContributions);

  // Fetch on-chain participant status for each unique sale
  useEffect(() => {
    if (!address || uniqueSaleAddresses.length === 0) return;
    const fetchStatuses = async () => {
      const statusMap: Record<string, number> = {};
      await Promise.all(
        uniqueSaleAddresses.map(async (saleAddr) => {
          const p = await getParticipant(saleAddr, address);
          if (p) {
            statusMap[saleAddr] = (
              p as { participant: string; amount: bigint; status: number }
            ).status;
          }
        }),
      );
      setParticipantStatuses(statusMap);
    };
    fetchStatuses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, purchases.length]);

  // Build contribution items by joining purchases with presale metadata
  const contributions: ContributionItem[] = uniqueSaleAddresses.map(
    (saleAddr) => {
      const presaleRaw = presales.find((p) => p.saleAddress === saleAddr);
      const meta = presaleRaw
        ? decodeSalesJson(presaleRaw.salesJson ?? "")
        : null;
      const saleStatus = presaleRaw
        ? computePresaleStatus(
            BigInt(presaleRaw.startTime ?? "0"),
            BigInt(presaleRaw.endTime ?? "0"),
            BigInt(presaleRaw.saleSold ?? "0"),
            BigInt(presaleRaw.hardCap ?? "0"),
            presaleRaw.status,
          )
        : "ended";

      const hardCapBig = BigInt(presaleRaw?.hardCap ?? "0");
      const totalTokensBig = BigInt(presaleRaw?.totalTokensForSale ?? "0");
      const presaleRate =
        hardCapBig > 0n ? Number(totalTokensBig) / Number(hardCapBig) : 0;

      const contributed = saleContributions[saleAddr];
      const estimatedTokens = contributed * presaleRate;

      return {
        saleAddress: saleAddr,
        name: meta?.name ?? `Sale ${saleAddr.slice(0, 8)}`,
        symbol: meta?.symbol ?? "???",
        logo: meta?.logoUrl ?? "🚀",
        saleStatus,
        contributed,
        estimatedTokens,
        participantStatus: participantStatuses[saleAddr] ?? 0,
      };
    },
  );

  const totalContributed = contributions.reduce(
    (sum, c) => sum + c.contributed,
    0,
  );
  const claimableCount = contributions.filter(
    (c) => c.participantStatus === 0 && c.saleStatus === "finalized",
  ).length;

  const loading = purchasesLoading || presalesLoading;

  if (!isConnected) {
    return (
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-20 text-center">
        <div className="text-5xl mb-4">🔒</div>
        <div className="text-lg font-semibold mb-2">Wallet Not Connected</div>
        <div className="text-zinc-500">
          Connect your wallet to view your portfolio
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-6 md:py-10">
      <h1 className="text-2xl md:text-3xl font-bold mb-2">Your Portfolio</h1>
      <p className="text-zinc-500 text-sm mb-6 md:mb-10">
        Track your presale contributions and claims
      </p>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-3 md:gap-5 mb-8 md:mb-10">
        {[
          {
            label: "Total Contributed",
            value: loading ? "..." : `${totalContributed.toFixed(4)} BOT`,
          },
          {
            label: "Projects Participated",
            value: loading ? "..." : String(contributions.length),
          },
          {
            label: "Claimable Sales",
            value: loading ? "..." : String(claimableCount),
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-gradient-to-br from-zinc-900/60 to-zinc-900/30 rounded-2xl border border-zinc-800/40 p-4 md:p-6"
          >
            <div className="text-xs text-zinc-500 mb-2">{stat.label}</div>
            <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Contributions List */}
      <h2 className="text-base md:text-lg font-semibold mb-4">
        Your Contributions
      </h2>

      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 bg-zinc-800/30 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      )}

      {!loading && contributions.length === 0 && (
        <div className="text-center py-16">
          <div className="text-4xl mb-3">🚀</div>
          <div className="text-zinc-500 mb-4">No contributions yet</div>
          <button
            onClick={() => navigate("/sales")}
            className="bg-gradient-to-r from-emerald-400 to-emerald-500 text-black font-bold px-6 py-2.5 rounded-xl text-sm"
          >
            Explore Sales
          </button>
        </div>
      )}

      {!loading && contributions.length > 0 && (
        <div className="space-y-3 md:space-y-4">
          {contributions.map((item) => {
            const claimLabel =
              item.participantStatus === 1
                ? "Claimed"
                : item.participantStatus === 2
                  ? "Refunded"
                  : item.saleStatus === "finalized"
                    ? "Claimable"
                    : "Pending";

            const claimColor =
              item.participantStatus === 1
                ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                : item.participantStatus === 2
                  ? "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
                  : item.saleStatus === "finalized"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";

            return (
              <div
                key={item.saleAddress}
                onClick={() => navigate(`/sales/${item.saleAddress}`)}
                className="bg-gradient-to-br from-zinc-900/60 to-zinc-900/30 rounded-2xl border border-zinc-800/40 p-4 md:p-6 cursor-pointer hover:border-zinc-700/60 transition-all flex flex-col md:flex-row justify-between md:items-center gap-4 md:gap-0"
              >
                <div className="flex gap-3 md:gap-4 items-center">
                  <div className="w-11 h-11 rounded-xl bg-zinc-800/50 flex items-center justify-center text-xl overflow-hidden flex-shrink-0">
                    {item.logo?.startsWith("http") ? (
                      <img
                        src={item.logo}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      item.logo || "🚀"
                    )}
                  </div>
                  <div>
                    <div className="text-sm md:text-base font-semibold">
                      {item.name}
                    </div>
                    <div className="text-xs text-zinc-500">${item.symbol}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 md:gap-6 justify-between md:justify-end flex-wrap">
                  <div className="text-right">
                    <div className="text-xs text-zinc-500 mb-0.5">
                      Contributed
                    </div>
                    <div className="text-sm font-semibold">
                      {item.contributed.toFixed(4)} BOT
                    </div>
                  </div>

                  {item.estimatedTokens > 0 && (
                    <div className="text-right">
                      <div className="text-xs text-zinc-500 mb-0.5">
                        Est. Tokens
                      </div>
                      <div className="text-sm font-semibold">
                        {item.estimatedTokens.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })}{" "}
                        {item.symbol}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${claimColor}`}
                    >
                      {claimLabel}
                    </span>
                    <StatusBadge status={item.saleStatus} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
