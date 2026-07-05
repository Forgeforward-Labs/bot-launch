import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import { formatEther } from "viem";
import { formatDistanceToNow } from "date-fns";
import {
  useGetPresalesByOwnerQuery,
  useGetPresalePurchasesQuery,
} from "@/graphql/__generated__/types-and-hooks";
import StatusBadge from "@/components/launchpad/StatusBadge";
import Modal from "@/components/launchpad/Modal";
import FormInput from "@/components/launchpad/FormInput";
import useSales from "@/hooks/useSales";
import {
  decodeSalesJson,
  computePresaleStatus,
  formatEth,
} from "@/lib/salesJson";

type ModalType = "whitelist" | "export" | null;

export default function Admin() {
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();

  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Whitelist form state
  const [whitelistAddresses, setWhitelistAddresses] = useState("");
  // Export form state
  const [exportFormat, setExportFormat] = useState("csv");
  const [exportDataType, setExportDataType] = useState("contributors");

  const { finalizeSale, updateWhitelist } = useSales();

  // Fetch presales owned by connected wallet
  const {
    data: presalesData,
    loading: presalesLoading,
    refetch: refetchPresales,
  } = useGetPresalesByOwnerQuery({
    variables: { owner: address ?? "" },
    skip: !address,
    pollInterval: 30000,
  });

  const presales = presalesData?.Presale ?? [];
  const selectedPresale =
    presales.find((p) => p.saleAddress === selectedAddress) ?? null;

  // Fetch purchases for the selected presale
  const { data: purchasesData, loading: purchasesLoading } =
    useGetPresalePurchasesQuery({
      variables: { saleAddress: selectedAddress ?? "" },
      skip: !selectedAddress,
      pollInterval: 15000,
    });

  const purchases = purchasesData?.PresalePurchase ?? [];

  // Compute derived values for selected presale
  const meta = selectedPresale
    ? decodeSalesJson(selectedPresale.salesJson ?? "")
    : null;
  const presaleStatus = selectedPresale
    ? computePresaleStatus(
        BigInt(selectedPresale.startTime ?? "0"),
        BigInt(selectedPresale.endTime ?? "0"),
        BigInt(selectedPresale.saleSold ?? "0"),
        BigInt(selectedPresale.hardCap ?? "0"),
        selectedPresale.status,
      )
    : null;

  const raisedEth = selectedPresale
    ? parseFloat(formatEth(BigInt(selectedPresale.saleSold ?? "0"), 4))
    : 0;
  const hardCapEth = selectedPresale
    ? parseFloat(formatEth(BigInt(selectedPresale.hardCap ?? "0"), 4))
    : 0;
  const softCapEth = selectedPresale
    ? parseFloat(formatEth(BigInt(selectedPresale.softCap ?? "0"), 4))
    : 0;
  const fillPct =
    hardCapEth > 0 ? ((raisedEth / hardCapEth) * 100).toFixed(1) : "0.0";
  const participantCount = Number(selectedPresale?.participantCount ?? 0);

  const canFinalize =
    selectedPresale &&
    (presaleStatus === "ended" || presaleStatus === "filled") &&
    true;

  const handleFinalize = async () => {
    if (!selectedPresale || !address) return;
    setIsSubmitting(true);
    try {
      const receipt = await finalizeSale(selectedPresale.saleAddress, address);
      if (receipt) refetchPresales();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateWhitelist = async () => {
    if (!selectedPresale) return;
    const addresses = whitelistAddresses
      .split("\n")
      .map((a) => a.trim())
      .filter(Boolean);
    setIsSubmitting(true);
    try {
      const receipt = await updateWhitelist(
        selectedPresale.saleAddress,
        addresses,
      );
      if (receipt) {
        setActiveModal(null);
        setWhitelistAddresses("");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExport = () => {
    let content: string;
    if (exportFormat === "csv") {
      const header = "Address,Amount (BOT),Time";
      const rows = purchases.map((p) => {
        const time = new Date(Number(p.createdAt) * 1000).toISOString();
        const amount = formatEther(BigInt(p.ethAmount));
        return `${p.buyer},${amount},${time}`;
      });
      content = [header, ...rows].join("\n");
    } else {
      content = JSON.stringify(
        purchases.map((p) => ({
          address: p.buyer,
          amount: formatEther(BigInt(p.ethAmount)),
          createdAt: new Date(Number(p.createdAt) * 1000).toISOString(),
        })),
        null,
        2,
      );
    }
    const blob = new Blob([content], {
      type: exportFormat === "csv" ? "text/csv" : "application/json",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${meta?.symbol ?? selectedAddress?.slice(0, 8) ?? "sale"}_${exportDataType}.${exportFormat}`;
    a.click();
    setActiveModal(null);
  };

  const validWhitelistCount = whitelistAddresses
    .split("\n")
    .filter((a) => a.trim().startsWith("0x") && a.trim().length === 42).length;

  if (!isConnected) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-20 text-center">
        <div className="text-5xl mb-4">🔒</div>
        <div className="text-lg font-semibold mb-2">Wallet Not Connected</div>
        <div className="text-zinc-500">
          Connect your wallet to manage your presales
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10">
      {/* Whitelist Modal */}
      {activeModal === "whitelist" && (
        <Modal title="Update Whitelist" onClose={() => setActiveModal(null)}>
          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4 mb-6 flex gap-3">
            <span className="text-xl">ℹ️</span>
            <div>
              <div className="text-sm font-semibold text-cyan-400 mb-1">
                Merkle Tree Whitelist
              </div>
              <div className="text-xs text-zinc-400">
                Addresses will be compiled into a Merkle tree for gas-efficient
                verification. This requires two transactions: setting the
                whitelist period and the root hash.
              </div>
            </div>
          </div>

          <FormInput
            label="Wallet Addresses (one per line)"
            value={whitelistAddresses}
            onChange={(e) => setWhitelistAddresses(e.target.value)}
            placeholder={"0x1234...\n0xabcd..."}
            rows={8}
            required
          />

          <div className="bg-zinc-800/30 rounded-xl p-4 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Valid addresses</span>
              <span className="font-semibold">{validWhitelistCount}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setActiveModal(null)}
              className="flex-1 bg-zinc-800/50 border border-zinc-700/50 rounded-xl py-3.5 text-white font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateWhitelist}
              disabled={validWhitelistCount === 0 || isSubmitting}
              className={`flex-1 rounded-xl py-3.5 font-bold ${
                validWhitelistCount > 0 && !isSubmitting
                  ? "bg-gradient-to-r from-emerald-400 to-emerald-500 text-black"
                  : "bg-zinc-800/50 text-zinc-600 cursor-not-allowed"
              }`}
            >
              {isSubmitting ? "Updating..." : "Update Whitelist"}
            </button>
          </div>
        </Modal>
      )}

      {/* Export Modal */}
      {activeModal === "export" && (
        <Modal title="Export Data" onClose={() => setActiveModal(null)}>
          <div className="mb-6">
            <label className="block text-sm text-zinc-400 mb-3">
              Data to Export
            </label>
            <div className="space-y-2">
              {[
                {
                  id: "contributors",
                  label: "Contributors",
                  desc: "All contribution addresses and amounts",
                },
                {
                  id: "summary",
                  label: "Sale Summary",
                  desc: "Overview of sale metrics and status",
                },
              ].map((option) => (
                <div
                  key={option.id}
                  onClick={() => setExportDataType(option.id)}
                  className={`p-4 rounded-xl cursor-pointer flex items-center gap-3 transition-all
                    ${exportDataType === option.id ? "bg-emerald-500/10 border border-emerald-500/30" : "bg-zinc-800/30 border border-transparent"}`}
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex-shrink-0 ${exportDataType === option.id ? "border-emerald-400 bg-emerald-400" : "border-zinc-600"}`}
                    style={{
                      borderWidth: exportDataType === option.id ? "6px" : "2px",
                    }}
                  />
                  <div>
                    <div
                      className={`text-sm font-semibold ${exportDataType === option.id ? "text-emerald-400" : "text-white"}`}
                    >
                      {option.label}
                    </div>
                    <div className="text-xs text-zinc-500 mt-0.5">
                      {option.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm text-zinc-400 mb-3">Format</label>
            <div className="flex gap-3">
              {[
                { id: "csv", label: "CSV", icon: "📊" },
                { id: "json", label: "JSON", icon: "{ }" },
              ].map((format) => (
                <button
                  key={format.id}
                  onClick={() => setExportFormat(format.id)}
                  className={`flex-1 p-4 rounded-xl flex flex-col items-center gap-2 transition-all
                    ${exportFormat === format.id ? "bg-emerald-500/10 border border-emerald-500/30" : "bg-zinc-800/30 border border-zinc-700/30"}`}
                >
                  <span className="text-2xl">{format.icon}</span>
                  <span
                    className={`text-sm font-semibold ${exportFormat === format.id ? "text-emerald-400" : "text-zinc-400"}`}
                  >
                    {format.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-zinc-800/30 rounded-xl p-4 mb-6 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-500">Records to export</span>
              <span className="font-semibold">{purchases.length}</span>
            </div>
          </div>

          <button
            onClick={handleExport}
            disabled={purchases.length === 0}
            className={`w-full rounded-xl py-3.5 font-bold flex items-center justify-center gap-2 ${
              purchases.length > 0
                ? "bg-gradient-to-r from-emerald-400 to-emerald-500 text-black"
                : "bg-zinc-800/50 text-zinc-600 cursor-not-allowed"
            }`}
          >
            <span>⬇️</span> Download {exportFormat.toUpperCase()}
          </button>
        </Modal>
      )}

      {/* Page Header */}
      <div className="mb-6 md:mb-10">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-zinc-500 text-sm">Manage your presale deployments</p>
      </div>

      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setShowSidebar(!showSidebar)}
        className="md:hidden w-full bg-zinc-800/50 border border-zinc-700/30 rounded-xl px-4 py-3.5 text-white text-sm mb-4 flex justify-between items-center"
      >
        <span>
          {selectedPresale
            ? `Selected: ${meta?.name ?? selectedPresale.saleAddress.slice(0, 10)}`
            : "Select a presale"}
        </span>
        <span>{showSidebar ? "▲" : "▼"}</span>
      </button>

      <div className="grid md:grid-cols-[300px_1fr] gap-8">
        {/* Sidebar */}
        {showSidebar && (
          <div className="bg-gradient-to-br from-zinc-900/60 to-zinc-900/30 rounded-2xl border border-zinc-800/40 p-5">
            <div className="flex justify-between items-center mb-5">
              <span className="font-semibold">My Presales</span>
              <button
                onClick={() => navigate("/sales/create")}
                className="bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-lg px-3 py-2 text-black text-xs font-semibold"
              >
                + New
              </button>
            </div>

            {presalesLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-14 bg-zinc-800/30 rounded-xl animate-pulse"
                  />
                ))}
              </div>
            ) : presales.length === 0 ? (
              <div className="text-center py-8 text-zinc-500 text-sm">
                <div className="text-3xl mb-2">📋</div>
                <div>No presales yet</div>
              </div>
            ) : (
              <div className="space-y-2">
                {presales.map((presale) => {
                  const m = decodeSalesJson(presale.salesJson ?? "");
                  const s = computePresaleStatus(
                    BigInt(presale.startTime ?? "0"),
                    BigInt(presale.endTime ?? "0"),
                    BigInt(presale.saleSold ?? "0"),
                    BigInt(presale.hardCap ?? "0"),
                    presale.status,
                  );
                  return (
                    <div
                      key={presale.saleAddress}
                      onClick={() => {
                        setSelectedAddress(presale.saleAddress);
                        if (window.innerWidth < 768) setShowSidebar(false);
                      }}
                      className={`p-3.5 rounded-xl cursor-pointer flex items-center gap-3 transition-all
                        ${selectedAddress === presale.saleAddress ? "bg-emerald-500/10 border border-emerald-500/30" : "bg-zinc-800/30 border border-transparent hover:border-zinc-700/50"}`}
                    >
                      <div className="w-9 h-9 rounded-xl bg-zinc-700/50 flex items-center justify-center text-sm overflow-hidden flex-shrink-0">
                        {m?.logoUrl ? (
                          <img
                            src={m.logoUrl}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          "🚀"
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium truncate">
                          {m?.name ?? presale.saleAddress.slice(0, 10) + "..."}
                        </div>
                        <div className="text-[11px] text-zinc-500">{s}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Main Content */}
        <div>
          {selectedPresale ? (
            <div className="bg-gradient-to-br from-zinc-900/60 to-zinc-900/30 rounded-2xl border border-zinc-800/40 p-5 md:p-8">
              {/* Presale Header */}
              <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-6 md:mb-8">
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-700/50 flex items-center justify-center text-2xl overflow-hidden flex-shrink-0">
                    {meta?.logoUrl ? (
                      <img
                        src={meta.logoUrl}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      "🚀"
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold">
                      {meta?.name ??
                        selectedPresale.saleAddress.slice(0, 12) + "..."}
                    </h2>
                    <a
                      href={`https://scan.bohr.life/address/${selectedPresale.saleAddress}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-zinc-500 text-xs hover:text-emerald-400"
                    >
                      {selectedPresale.saleAddress.slice(0, 14)}...
                    </a>
                  </div>
                </div>
                <StatusBadge status={presaleStatus!} />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
                {[
                  { label: "Raised", value: `${raisedEth} BOT` },
                  { label: "Hard Cap", value: `${hardCapEth} BOT` },
                  { label: "Soft Cap", value: `${softCapEth} BOT` },
                  { label: "Fill %", value: `${fillPct}%` },
                  { label: "Participants", value: participantCount },
                  {
                    label: "Liquidity %",
                    value: `${selectedPresale.liquidityBPS ?? 0}%`,
                  },
                  { label: "Status", value: presaleStatus ?? "—" },
                  {
                    label: "Created",
                    value: formatDistanceToNow(
                      new Date(Number(selectedPresale.createdAt) * 1000),
                      { addSuffix: true },
                    ),
                  },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="bg-zinc-800/30 rounded-xl p-3.5 md:p-5"
                  >
                    <div className="text-[11px] text-zinc-600 mb-2">
                      {stat.label}
                    </div>
                    <div className="text-sm md:text-base font-bold capitalize">
                      {stat.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <h3 className="text-sm md:text-base font-semibold mb-4">
                Actions
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 md:mb-8">
                <button
                  onClick={() => setActiveModal("whitelist")}
                  className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl px-3 md:px-5 py-2.5 md:py-3 text-white text-xs md:text-sm font-medium hover:border-zinc-600 transition-colors"
                >
                  Update Whitelist
                </button>
                <button
                  onClick={() => setActiveModal("export")}
                  className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl px-3 md:px-5 py-2.5 md:py-3 text-white text-xs md:text-sm font-medium hover:border-zinc-600 transition-colors"
                >
                  Export Data
                </button>
                <button
                  disabled={!canFinalize || isSubmitting}
                  onClick={handleFinalize}
                  className={`rounded-xl px-3 md:px-5 py-2.5 md:py-3 text-xs md:text-sm font-semibold transition-colors ${
                    canFinalize && !isSubmitting
                      ? "bg-gradient-to-r from-emerald-400 to-emerald-500 text-black"
                      : "bg-zinc-800/50 text-zinc-600 cursor-not-allowed"
                  }`}
                >
                  {isSubmitting ? "Finalizing..." : "Finalize Sale"}
                </button>
                <button
                  disabled
                  className="bg-red-500/10 border border-red-500/30 rounded-xl px-3 md:px-5 py-2.5 md:py-3 text-red-400/40 text-xs md:text-sm font-medium cursor-not-allowed"
                  title="Cancel is not available on-chain"
                >
                  Cancel Sale
                </button>
              </div>

              {/* Recent Contributions */}
              <h3 className="text-sm md:text-base font-semibold mb-4">
                Recent Contributions
                {purchasesLoading && (
                  <span className="ml-2 text-xs text-zinc-500 font-normal">
                    Loading...
                  </span>
                )}
              </h3>

              {purchases.length === 0 && !purchasesLoading ? (
                <div className="bg-zinc-900/50 rounded-xl p-8 text-center text-zinc-500 text-sm">
                  No contributions yet
                </div>
              ) : (
                <>
                  {/* Mobile Cards */}
                  <div className="md:hidden space-y-2.5">
                    {purchases.slice(0, 10).map((tx) => (
                      <div
                        key={tx.id}
                        className="bg-zinc-900/50 rounded-xl p-3.5 flex justify-between items-center"
                      >
                        <div>
                          <div className="text-sm font-mono mb-1">
                            {tx.buyer.slice(0, 6)}...{tx.buyer.slice(-4)}
                          </div>
                          <div className="text-[11px] text-zinc-500">
                            {formatDistanceToNow(
                              new Date(Number(tx.createdAt) * 1000),
                              { addSuffix: true },
                            )}
                          </div>
                        </div>
                        <div className="text-sm font-semibold">
                          {parseFloat(
                            formatEther(BigInt(tx.ethAmount)),
                          ).toFixed(4)}{" "}
                          BOT
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop Table */}
                  <div className="hidden md:block bg-zinc-900/50 rounded-xl overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-zinc-800/30">
                          <th className="px-4 py-3.5 text-left text-[11px] text-zinc-600 font-medium">
                            ADDRESS
                          </th>
                          <th className="px-4 py-3.5 text-right text-[11px] text-zinc-600 font-medium">
                            AMOUNT
                          </th>
                          <th className="px-4 py-3.5 text-right text-[11px] text-zinc-600 font-medium">
                            TIME
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {purchases.slice(0, 10).map((tx) => (
                          <tr
                            key={tx.id}
                            className="border-b border-zinc-800/20"
                          >
                            <td className="px-4 py-3.5 text-sm font-mono">
                              {tx.buyer.slice(0, 8)}...{tx.buyer.slice(-6)}
                            </td>
                            <td className="px-4 py-3.5 text-sm text-right font-medium">
                              {parseFloat(
                                formatEther(BigInt(tx.ethAmount)),
                              ).toFixed(4)}{" "}
                              BOT
                            </td>
                            <td className="px-4 py-3.5 text-xs text-right text-zinc-500">
                              {formatDistanceToNow(
                                new Date(Number(tx.createdAt) * 1000),
                                { addSuffix: true },
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="bg-gradient-to-br from-zinc-900/60 to-zinc-900/30 rounded-2xl border border-zinc-800/40 p-12 md:p-20 text-center">
              <div className="text-5xl mb-4">📋</div>
              <div className="text-lg font-semibold text-white mb-2">
                No presale selected
              </div>
              <div className="text-zinc-500 mb-6">
                Select a presale from the list or create a new one
              </div>
              <button
                onClick={() => navigate("/sales/create")}
                className="bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-xl px-7 py-3.5 text-black font-bold inline-flex items-center gap-2"
              >
                <span>+</span> Create New Presale
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
