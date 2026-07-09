import { useState, type Dispatch, type SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import { useGetAllPresalesQuery } from "@/graphql/__generated__/types-and-hooks";
import PresaleCard from "@/components/launchpad/PresaleCard";
import PresaleListItem from "@/components/launchpad/PresaleListItem";
import { decodeSalesJson, computePresaleStatus, formatEth } from "@/lib/salesJson";
import type { Presale } from "@/lib/launchpad-data";

interface Filters {
  status: string;
  sortBy: string;
  tags: string[];
  minCap: string;
  maxCap: string;
  search: string;
}

function FilterPanel({
  filters,
  setFilters,
  allTags,
  statusCounts,
  toggleTag,
  clearFilters,
  activeFiltersCount,
  filteredCount,
  inDrawer,
  onApply,
}: {
  filters: Filters;
  setFilters: Dispatch<SetStateAction<Filters>>;
  allTags: string[];
  statusCounts: Record<string, number>;
  toggleTag: (tag: string) => void;
  clearFilters: () => void;
  activeFiltersCount: number;
  filteredCount: number;
  inDrawer?: boolean;
  onApply?: () => void;
}) {
  return (
    <div
      className={
        inDrawer
          ? ""
          : "bg-gradient-to-br from-zinc-900/60 to-zinc-900/30 rounded-2xl border border-zinc-800/40 p-6 sticky top-24"
      }
    >
      <div className="flex justify-between items-center mb-6">
        <span className="font-semibold">Filters</span>
        {activeFiltersCount > 0 && (
          <button
            onClick={clearFilters}
            className="text-emerald-400 text-xs hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="mb-7">
        <div className="text-xs text-zinc-500 mb-3 uppercase tracking-wider">
          Status
        </div>
        <div className="flex flex-col gap-1.5">
          {["all", "live", "upcoming", "filled", "finalized", "ended"].map((status) => (
            <button
              key={status}
              onClick={() => setFilters((prev) => ({ ...prev, status }))}
              className={`px-3.5 py-2.5 rounded-lg text-sm font-medium capitalize text-left flex justify-between items-center transition-all
                ${
                  filters.status === status
                    ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                    : "border border-transparent text-zinc-400 hover:text-white"
                }`}
            >
              <span>{status}</span>
              <span
                className={`px-2 py-0.5 rounded text-[11px] ${
                  filters.status === status
                    ? "bg-emerald-500/20"
                    : "bg-zinc-700/50"
                }`}
              >
                {statusCounts[status] ?? 0}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-7">
        <div className="text-xs text-zinc-500 mb-3 uppercase tracking-wider">
          Categories
        </div>
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1.5 rounded-md text-xs transition-all
                ${
                  filters.tags.includes(tag)
                    ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400"
                    : "bg-zinc-800/50 border border-zinc-700/30 text-zinc-400"
                }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-7">
        <div className="text-xs text-zinc-500 mb-3 uppercase tracking-wider">
          Hard Cap Range (BOT)
        </div>
        <div className="flex gap-3">
          <input
            type="number"
            placeholder="Min"
            value={filters.minCap}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, minCap: e.target.value }))
            }
            className="flex-1 bg-zinc-900/80 border border-zinc-700/50 rounded-lg px-3 py-2.5 text-white text-sm outline-none focus:border-zinc-600 placeholder:text-zinc-600 w-full"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxCap}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, maxCap: e.target.value }))
            }
            className="flex-1 bg-zinc-900/80 border border-zinc-700/50 rounded-lg px-3 py-2.5 text-white text-sm outline-none focus:border-zinc-600 placeholder:text-zinc-600 w-full"
          />
        </div>
      </div>

      <div>
        <div className="text-xs text-zinc-500 mb-3 uppercase tracking-wider">
          Sort By
        </div>
        <select
          value={filters.sortBy}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, sortBy: e.target.value }))
          }
          className="w-full bg-zinc-900/80 border border-zinc-700/50 rounded-lg px-3.5 py-3 text-white text-sm outline-none cursor-pointer focus:border-zinc-600"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="hardcap-high">Hard Cap: High to Low</option>
          <option value="hardcap-low">Hard Cap: Low to High</option>
          <option value="progress">Progress %</option>
          <option value="participants">Most Participants</option>
        </select>
      </div>

      {inDrawer && (
        <button
          onClick={onApply}
          className="w-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-xl py-3.5 text-black text-base font-bold mt-6"
        >
          Apply Filters ({filteredCount} results)
        </button>
      )}
    </div>
  );
}

function mapToPresale(p: {
  id: string;
  saleAddress: string;
  status: string;
  startTime?: string | null;
  endTime?: string | null;
  softCap?: string | null;
  hardCap?: string | null;
  totalTokensForSale?: string | null;
  liquidityBPS?: string | null;
  salesJson?: string | null;
  saleSold?: string | null;
  participantCount?: string | null;
}): Presale & { saleAddress: string } {
  const meta = decodeSalesJson(p.salesJson ?? "");
  const startTime = BigInt(p.startTime ?? "0");
  const endTime = BigInt(p.endTime ?? "0");
  const saleSold = BigInt(p.saleSold ?? "0");
  const hardCap = BigInt(p.hardCap ?? "0");
  const softCap = BigInt(p.softCap ?? "0");
  const totalTokensForSale = BigInt(p.totalTokensForSale ?? "0");
  const liquidityBPS = Number(p.liquidityBPS ?? 0);

  const status = computePresaleStatus(startTime, endTime, saleSold, hardCap, p.status);
  const hardCapEth = parseFloat(formatEth(hardCap, 6));
  const softCapEth = parseFloat(formatEth(softCap, 6));
  const raisedEth = parseFloat(formatEth(saleSold, 6));
  const presaleRate =
    hardCap > 0n ? (Number(totalTokensForSale) / Number(hardCap)) * 1e18 : 0;

  return {
    id: 0,
    saleAddress: p.saleAddress,
    name: meta?.name ?? `Sale ${p.saleAddress.slice(0, 8)}`,
    symbol: meta?.symbol ?? "???",
    logo: meta?.logoUrl ?? "🚀",
    description: meta?.description ?? "No description provided.",
    status,
    softCap: softCapEth,
    hardCap: hardCapEth,
    raised: raisedEth,
    presaleRate,
    listingRate: presaleRate * 0.8,
    startTime: Number(startTime),
    endTime: Number(endTime),
    liquidity: liquidityBPS,
    lockDays: 365,
    participants: Number(p.participantCount ?? 0),
    tags: meta?.tags ?? [],
  };
}

export default function Sales() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<Filters>({
    status: "all",
    sortBy: "newest",
    tags: [],
    minCap: "",
    maxCap: "",
    search: "",
  });
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const { data, loading, error } = useGetAllPresalesQuery({ pollInterval: 15000 });

  const presales = (data?.Presale ?? []).map(mapToPresale);
  const allTags = [...new Set(presales.flatMap((p) => p.tags))];

  const toggleTag = (tag: string) =>
    setFilters((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));

  const clearFilters = () =>
    setFilters({ status: "all", sortBy: "newest", tags: [], minCap: "", maxCap: "", search: "" });

  const filteredPresales = presales
    .filter((p) => {
      if (filters.status !== "all" && p.status !== filters.status) return false;
      if (filters.tags.length > 0 && !filters.tags.some((t) => p.tags.includes(t))) return false;
      if (filters.minCap && p.hardCap < parseFloat(filters.minCap)) return false;
      if (filters.maxCap && p.hardCap > parseFloat(filters.maxCap)) return false;
      if (filters.search) {
        const s = filters.search.toLowerCase();
        if (!p.name.toLowerCase().includes(s) && !p.symbol.toLowerCase().includes(s) && !p.description.toLowerCase().includes(s))
          return false;
      }
      return true;
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case "newest": return b.startTime - a.startTime;
        case "oldest": return a.startTime - b.startTime;
        case "hardcap-high": return b.hardCap - a.hardCap;
        case "hardcap-low": return a.hardCap - b.hardCap;
        case "progress": return b.hardCap > 0 ? b.raised / b.hardCap - a.raised / a.hardCap : 0;
        case "participants": return b.participants - a.participants;
        default: return 0;
      }
    });

  const activeFiltersCount = [
    filters.status !== "all",
    filters.tags.length > 0,
    filters.minCap,
    filters.maxCap,
  ].filter(Boolean).length;

  const statusCounts: Record<string, number> = {
    all: presales.length,
    live: presales.filter((p) => p.status === "live").length,
    upcoming: presales.filter((p) => p.status === "upcoming").length,
    filled: presales.filter((p) => p.status === "filled").length,
    finalized: presales.filter((p) => p.status === "finalized").length,
    ended: presales.filter((p) => (p.status as string) === "ended").length,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10">
      {mobileFilterOpen && (
        <>
          <div className="fixed inset-0 bg-black/70 z-[200]" onClick={() => setMobileFilterOpen(false)} />
          <div className="fixed top-0 right-0 bottom-0 w-[85%] max-w-[340px] bg-zinc-950 z-[201] p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-bold">Filters</span>
              <button onClick={() => setMobileFilterOpen(false)} className="text-white text-2xl">✕</button>
            </div>
            <FilterPanel
              filters={filters} setFilters={setFilters} allTags={allTags}
              statusCounts={statusCounts} toggleTag={toggleTag} clearFilters={clearFilters}
              activeFiltersCount={activeFiltersCount} filteredCount={filteredPresales.length}
              inDrawer onApply={() => setMobileFilterOpen(false)}
            />
          </div>
        </>
      )}

      <div className="flex justify-between items-center mb-5 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">All Sales</h1>
          <p className="text-zinc-500 text-sm md:text-base">Browse and filter all presale opportunities</p>
        </div>
        <button
          onClick={() => navigate("/apply")}
          className="bg-gradient-to-r from-emerald-400 to-emerald-500 text-black font-bold px-5 py-2.5 rounded-xl text-sm hover:opacity-90 transition-opacity"
        >
          + Create Sale
        </button>
      </div>

      <div className="flex gap-8">
        {showFilters && (
          <div className="hidden md:block w-72 flex-shrink-0">
            <FilterPanel
              filters={filters} setFilters={setFilters} allTags={allTags}
              statusCounts={statusCounts} toggleTag={toggleTag} clearFilters={clearFilters}
              activeFiltersCount={activeFiltersCount} filteredCount={filteredPresales.length}
            />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3 mb-6">
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => window.innerWidth < 768 ? setMobileFilterOpen(true) : setShowFilters(!showFilters)}
                className="bg-zinc-800/50 border border-zinc-700/30 rounded-xl px-4 py-3 text-zinc-400 text-sm flex items-center gap-2 hover:border-zinc-600 transition-colors"
              >
                <span>☰</span> Filters
                {activeFiltersCount > 0 && (
                  <span className="bg-emerald-400 text-black px-1.5 py-0.5 rounded text-[11px] font-semibold">{activeFiltersCount}</span>
                )}
              </button>
              <div className="relative flex-1 md:flex-none">
                <input
                  type="text"
                  placeholder="Search..."
                  value={filters.search}
                  onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                  className="bg-zinc-800/50 border border-zinc-700/30 rounded-xl py-3 pl-10 pr-4 text-white text-sm w-full md:w-72 outline-none focus:border-zinc-600 placeholder:text-zinc-500"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">🔍</span>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-between md:justify-end">
              <span className="text-zinc-500 text-sm">{filteredPresales.length} results</span>
              <div className="hidden md:flex bg-zinc-800/50 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-2 rounded-md text-sm ${viewMode === "grid" ? "bg-emerald-500/15 text-emerald-400" : "text-zinc-500"}`}
                >▦</button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-2 rounded-md text-sm ${viewMode === "list" ? "bg-emerald-500/15 text-emerald-400" : "text-zinc-500"}`}
                >☰</button>
              </div>
            </div>
          </div>

          {(filters.tags.length > 0 || filters.minCap || filters.maxCap) && (
            <div className="flex flex-wrap gap-2 mb-6">
              {filters.tags.map((tag) => (
                <span key={tag} className="bg-emerald-500/10 border border-emerald-500/30 rounded-md px-3 py-1.5 text-emerald-400 text-xs flex items-center gap-2">
                  {tag}
                  <button onClick={() => toggleTag(tag)} className="hover:text-white">×</button>
                </span>
              ))}
              {(filters.minCap || filters.maxCap) && (
                <span className="bg-cyan-500/10 border border-cyan-500/30 rounded-md px-3 py-1.5 text-cyan-400 text-xs flex items-center gap-2">
                  Cap: {filters.minCap || "0"} - {filters.maxCap || "∞"} BOT
                  <button onClick={() => setFilters((prev) => ({ ...prev, minCap: "", maxCap: "" }))} className="hover:text-white">×</button>
                </span>
              )}
            </div>
          )}

          {loading && (
            <div className="text-center py-20 text-zinc-500">
              <div className="text-5xl mb-4">⏳</div>
              <div className="text-lg">Loading presales...</div>
            </div>
          )}

          {error && (
            <div className="text-center py-20 text-zinc-500">
              <div className="text-5xl mb-4">⚠️</div>
              <div className="text-lg mb-2">Failed to load presales</div>
              <div className="text-sm text-zinc-600">{error.message}</div>
            </div>
          )}

          {!loading && !error && viewMode === "grid" && (
            <div className={`grid gap-4 md:gap-6 ${showFilters ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"}`}>
              {filteredPresales.map((presale) => (
                <PresaleCard
                  key={presale.saleAddress}
                  presale={presale}
                  onClick={() => navigate(`/sales/${presale.saleAddress}`)}
                />
              ))}
            </div>
          )}

          {!loading && !error && viewMode === "list" && (
            <div className="flex flex-col gap-3">
              {filteredPresales.map((presale) => (
                <PresaleListItem
                  key={presale.saleAddress}
                  presale={presale}
                  onClick={() => navigate(`/sales/${presale.saleAddress}`)}
                />
              ))}
            </div>
          )}

          {!loading && !error && filteredPresales.length === 0 && (
            <div className="text-center py-20 text-zinc-500">
              <div className="text-5xl mb-4">🔍</div>
              <div className="text-lg mb-2">
                {presales.length === 0 ? "No presales yet" : "No presales found"}
              </div>
              <div className="text-sm mb-5">
                {presales.length === 0 ? "Be the first to create a presale!" : "Try adjusting your filters"}
              </div>
              {presales.length === 0 ? (
                <button
                  onClick={() => navigate("/apply")}
                  className="bg-gradient-to-r from-emerald-400 to-emerald-500 text-black font-bold px-6 py-2.5 rounded-xl text-sm"
                >
                  Create First Sale
                </button>
              ) : (
                <button onClick={clearFilters} className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-5 py-2.5 text-emerald-400 text-sm">
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
