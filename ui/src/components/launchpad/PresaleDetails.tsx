import React, { useState } from "react";
import { MOCK_PRESALES, MOCK_WHITELIST } from "@/lib/launchpad-data";
import { useAccount } from "wagmi";
import { useNavigate } from "react-router-dom";
import StatusBadge from "./StatusBadge";
import Countdown from "./Countdown";
import PresaleProgressBar from "./PresaleProgressBar";

export default function PresaleDetailView() {
  const [contribution, setContribution] = useState("");
  const [activeTab, setActiveTab] = useState("contribute");
  const { isConnected } = useAccount();
  const navigator = useNavigate();

  const onBack = () => navigator("/");

  const presale = MOCK_PRESALES[0];
  const whitelistInfo = MOCK_WHITELIST;

  const userContribution = 0.5;
  const canContribute =
    presale.status === "live" && isConnected && whitelistInfo.isWhitelisted;
  const remainingAllocation = whitelistInfo.allocation - userContribution;

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-5 md:py-10">
      <button
        onClick={onBack}
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
                <div
                  className="w-14 h-14 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-gradient-to-br from-zinc-800 to-zinc-700 
                                flex items-center justify-center text-3xl md:text-4xl"
                >
                  {presale.logo}
                </div>
                <div>
                  <h1 className="text-xl md:text-3xl font-bold text-white">
                    {presale.name}
                  </h1>
                  <div className="text-sm md:text-base text-zinc-500 mt-1">
                    ${presale.symbol}
                  </div>
                </div>
              </div>
              <StatusBadge status={presale.status} />
            </div>

            <p className="text-sm md:text-base text-zinc-400 leading-relaxed mt-4 md:mt-6 mb-4 md:mb-6">
              {presale.description}. This project aims to revolutionize the
              space with cutting-edge technology and a dedicated team of
              experienced developers.
            </p>

            <div className="flex gap-2 flex-wrap">
              {presale.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-zinc-800/50 px-3 py-1.5 rounded-lg text-xs text-zinc-400"
                >
                  {tag}
                </span>
              ))}
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
                  {presale.status === "live"
                    ? "Ends in"
                    : presale.status === "upcoming"
                      ? "Starts in"
                      : "Ended"}
                </div>
                {(presale.status === "live" ||
                  presale.status === "upcoming") && (
                  <Countdown
                    endTime={
                      presale.status === "live"
                        ? presale.endTime
                        : presale.startTime
                    }
                  />
                )}
              </div>
            </div>

            <PresaleProgressBar value={presale.raised} max={presale.hardCap} />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 mt-5 md:mt-7">
              {[
                { label: "Soft Cap", value: `${presale.softCap} ETH` },
                { label: "Hard Cap", value: `${presale.hardCap} ETH` },
                { label: "Raised", value: `${presale.raised} ETH` },
                { label: "Participants", value: presale.participants },
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
                  value: `1 ETH = ${presale.presaleRate.toLocaleString()} ${presale.symbol}`,
                },
                {
                  label: "Listing Rate",
                  value: `1 ETH = ${presale.listingRate.toLocaleString()} ${presale.symbol}`,
                },
                { label: "Liquidity %", value: `${presale.liquidity}%` },
                { label: "LP Lock", value: "Permanent" },
              ].map((item, i) => (
                <div key={i} className="bg-zinc-800/30 rounded-xl p-3.5 md:p-4">
                  <div className="text-[11px] text-zinc-600 mb-2">
                    {item.label}
                  </div>
                  <div className="text-sm md:text-sm font-medium">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4 md:space-y-6">
          {/* Whitelist Status */}
          <div
            className={`rounded-2xl p-4 md:p-5 ${
              whitelistInfo.isWhitelisted
                ? "bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/30"
                : "bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/30"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">
                {whitelistInfo.isWhitelisted ? "✓" : "✗"}
              </span>
              <div>
                <div
                  className={`text-sm font-semibold ${whitelistInfo.isWhitelisted ? "text-emerald-400" : "text-red-400"}`}
                >
                  {whitelistInfo.isWhitelisted
                    ? "Whitelisted"
                    : "Not Whitelisted"}
                </div>
                {whitelistInfo.isWhitelisted && (
                  <div className="text-xs text-zinc-400 mt-0.5">
                    {whitelistInfo.tier} Tier • {whitelistInfo.allocation} ETH
                    allocation
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Contribution Panel */}
          <div className="card-gradient-strong rounded-2xl md:rounded-3xl border border-zinc-800/40 p-5 md:p-7">
            {/* Tabs */}
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
                    <span>Amount (ETH)</span>
                    <span>Max: {remainingAllocation.toFixed(2)} ETH</span>
                  </div>
                  <div className="flex bg-zinc-900/80 rounded-xl border border-zinc-700/50 overflow-hidden">
                    <input
                      type="number"
                      placeholder="0.0"
                      value={contribution}
                      onChange={(e) => setContribution(e.target.value)}
                      disabled={!canContribute}
                      className="flex-1 bg-transparent px-4 py-4 text-white text-lg font-medium"
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
                      {contribution
                        ? (
                            parseFloat(contribution) * presale.presaleRate
                          ).toLocaleString()
                        : "0"}{" "}
                      {presale.symbol}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-zinc-400">
                    <span>Your total contribution</span>
                    <span className="text-white font-semibold">
                      {(
                        userContribution + (parseFloat(contribution) || 0)
                      ).toFixed(2)}{" "}
                      ETH
                    </span>
                  </div>
                </div>

                <button
                  disabled={!canContribute || !contribution}
                  className={`w-full rounded-xl py-4 text-base font-bold transition-all
                    ${
                      canContribute && contribution
                        ? "gradient-btn text-black"
                        : "bg-zinc-800/50 text-zinc-600 cursor-not-allowed"
                    }`}
                >
                  {!isConnected
                    ? "Connect Wallet"
                    : !whitelistInfo.isWhitelisted
                      ? "Not Whitelisted"
                      : presale.status !== "live"
                        ? "Sale Not Active"
                        : "Contribute"}
                </button>
              </>
            ) : (
              <>
                <div className="bg-zinc-800/30 rounded-xl p-6 text-center mb-5">
                  <div className="text-xs text-zinc-500 mb-2">Your Tokens</div>
                  <div className="text-3xl font-bold gradient-text">
                    {(userContribution * presale.presaleRate).toLocaleString()}{" "}
                    {presale.symbol}
                  </div>
                </div>

                <button
                  disabled={presale.status !== "finalized"}
                  className={`w-full rounded-xl py-4 text-base font-bold transition-all
                    ${
                      presale.status === "finalized"
                        ? "gradient-btn text-black"
                        : "bg-zinc-800/50 text-zinc-600 cursor-not-allowed"
                    }`}
                >
                  {presale.status === "finalized"
                    ? "Claim Tokens"
                    : "Claim Available After Finalization"}
                </button>
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
                { label: "Contributed", value: `${userContribution} ETH` },
                {
                  label: "Tokens to Receive",
                  value: `${(userContribution * presale.presaleRate).toLocaleString()} ${presale.symbol}`,
                },
                {
                  label: "Remaining Allocation",
                  value: `${remainingAllocation.toFixed(2)} ETH`,
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
