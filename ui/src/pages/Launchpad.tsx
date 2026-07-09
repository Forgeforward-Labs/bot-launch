import { Rocket, TrendingUp, Users, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGetPlatformStatsQuery, useGetAllPresalesQuery } from "@/graphql/__generated__/types-and-hooks";
import { decodeSalesJson, computePresaleStatus, formatEth } from "@/lib/salesJson";
import StatusBadge from "@/components/launchpad/StatusBadge";
import PresaleProgressBar from "@/components/launchpad/PresaleProgressBar";

const Launchpad = () => {
  const navigate = useNavigate();
  const { data: statsData } = useGetPlatformStatsQuery({ pollInterval: 30000 });
  const { data: presalesData } = useGetAllPresalesQuery({ pollInterval: 30000 });

  const stats = statsData?.PlatformStats;
  const allPresales = presalesData?.Presale ?? [];

  // Get the 3 most recent/active presales for featured section
  const featuredPresales = allPresales.slice(0, 3).map((p) => {
    const meta = decodeSalesJson(p.salesJson ?? "");
    const startTime = BigInt(p.startTime ?? "0");
    const endTime = BigInt(p.endTime ?? "0");
    const saleSold = BigInt(p.saleSold ?? "0");
    const hardCap = BigInt(p.hardCap ?? "0");
    const softCap = BigInt(p.softCap ?? "0");
    const status = computePresaleStatus(startTime, endTime, saleSold, hardCap, p.status);
    return {
      saleAddress: p.saleAddress,
      name: meta?.name ?? `Sale ${p.saleAddress.slice(0, 8)}`,
      symbol: meta?.symbol ?? "???",
      description: meta?.description ?? "No description provided.",
      logo: meta?.logoUrl ?? "🚀",
      raised: parseFloat(formatEth(saleSold, 4)),
      hardCap: parseFloat(formatEth(hardCap, 4)),
      softCap: parseFloat(formatEth(softCap, 4)),
      participants: Number(p.participantCount ?? 0),
      status,
    };
  });

  return (
    <div className="min-h-screen bg-zinc-950">
      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">
                Forge
              </span>
            </h1>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              Discover and participate in the latest token launches on BOT Chain
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-gradient-to-br from-zinc-900/90 to-zinc-900/50 rounded-2xl border border-zinc-700/40 p-6">
              <div className="flex items-center space-x-3">
                <Rocket className="w-8 h-8 text-emerald-400" />
                <div>
                  <p className="text-2xl font-bold text-white">
                    {stats ? stats.totalSales : "—"}
                  </p>
                  <p className="text-sm text-zinc-500">Total Launches</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-zinc-900/90 to-zinc-900/50 rounded-2xl border border-zinc-700/40 p-6">
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-8 h-8 text-emerald-400" />
                <div>
                  <p className="text-2xl font-bold text-white">
                    {allPresales.reduce((acc, p) => acc + parseFloat(formatEth(BigInt(p.saleSold ?? "0"), 2)), 0).toLocaleString()} BOT
                  </p>
                  <p className="text-sm text-zinc-500">Total Raised</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-zinc-900/90 to-zinc-900/50 rounded-2xl border border-zinc-700/40 p-6">
              <div className="flex items-center space-x-3">
                <Users className="w-8 h-8 text-green-400" />
                <div>
                  <p className="text-2xl font-bold text-white">
                    {allPresales.reduce((acc, p) => acc + Number(p.participantCount ?? 0), 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-zinc-500">Participants</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-zinc-900/90 to-zinc-900/50 rounded-2xl border border-zinc-700/40 p-6">
              <div className="flex items-center space-x-3">
                <Zap className="w-8 h-8 text-yellow-400" />
                <div>
                  <p className="text-2xl font-bold text-white">
                    {allPresales.filter((p) => {
                      const now = BigInt(Math.floor(Date.now() / 1000));
                      const start = BigInt(p.startTime ?? "0");
                      const end = BigInt(p.endTime ?? "0");
                      return p.status === "ACTIVE" && now >= start && now <= end;
                    }).length}
                  </p>
                  <p className="text-sm text-zinc-500">Active Launches</p>
                </div>
              </div>
            </div>
          </div>

          {/* Featured Launches */}
          <div className="space-y-6 mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Featured Launches</h2>
              <button
                onClick={() => navigate("/sales")}
                className="text-emerald-400 text-sm hover:underline"
              >
                View all →
              </button>
            </div>

            {featuredPresales.length === 0 && (
              <div className="text-center py-12 text-zinc-500">
                <div className="text-4xl mb-3">🚀</div>
                <p>No launches yet. Be the first!</p>
              </div>
            )}

            {featuredPresales.map((launch) => (
              <div
                key={launch.saleAddress}
                onClick={() => navigate(`/sales/${launch.saleAddress}`)}
                className="bg-gradient-to-br from-zinc-900/90 to-zinc-900/50 rounded-2xl border border-zinc-700/40 p-6 hover:border-zinc-600 transition-colors cursor-pointer"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-xl flex items-center justify-center text-xl overflow-hidden">
                      {launch.logo.startsWith("http") ? (
                        <img src={launch.logo} alt="logo" className="w-full h-full object-cover" />
                      ) : (
                        launch.logo
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">{launch.name}</h3>
                      <p className="text-zinc-400 text-sm">{launch.description}</p>
                    </div>
                  </div>
                  <StatusBadge status={launch.status} />
                </div>

                <div className="mb-6">
                  <PresaleProgressBar value={launch.raised} max={launch.hardCap} />
                  <div className="flex justify-between mt-1 text-xs text-zinc-500">
                    <span>{launch.raised} BOT raised</span>
                    <span>{launch.hardCap} BOT hard cap</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-zinc-500">Soft Cap</p>
                    <p className="text-lg font-semibold text-white">{launch.softCap} BOT</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-zinc-500">Participants</p>
                    <p className="text-lg font-semibold text-white">{launch.participants.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-zinc-500">Symbol</p>
                    <p className="text-lg font-semibold text-white">{launch.symbol}</p>
                  </div>
                  <div className="text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/sales/${launch.saleAddress}`);
                      }}
                      className={`w-full py-2 rounded-xl font-semibold transition-all ${
                        launch.status === "live"
                          ? "bg-gradient-to-r from-emerald-400 to-emerald-500 text-black hover:opacity-90"
                          : "bg-zinc-800 text-zinc-500 cursor-default"
                      }`}
                    >
                      {launch.status === "live" ? "Participate" : launch.status === "finalized" ? "Finalized" : "View"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Create Sale CTA */}
          <div className="bg-gradient-to-br from-zinc-900/90 to-zinc-900/50 rounded-2xl border border-zinc-700/40 text-center p-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              Want to Launch Your Project?
            </h3>
            <p className="text-zinc-400 mb-6 max-w-2xl mx-auto">
              Create a presale on BOT Chain and get access to our community of investors and DeFi enthusiasts.
            </p>
            <button
              onClick={() => navigate("/sales/create")}
              className="bg-gradient-to-r from-emerald-400 to-emerald-500 text-black font-bold px-8 py-3 rounded-xl flex items-center gap-2 mx-auto hover:opacity-90 transition-opacity"
            >
              <Rocket className="w-5 h-5" />
              Create a Sale
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Launchpad;
