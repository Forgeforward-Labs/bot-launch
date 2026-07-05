import React from "react";
import StatusBadge from "./launchpad/StatusBadge";
import PresaleProgressBar from "./launchpad/PresaleProgressBar";
import { Presale } from "@/lib/launchpad-data";
// import {type Presale } from "./HeroSection";
// import StatusBadge from './StatusBadge';
// import ProgressBar from './ProgressBar';

export default function PresaleCard({
  presale,
  onClick,
}: {
  presale: Presale;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="card-gradient rounded-2xl border border-zinc-800/40 p-5 md:p-6 cursor-pointer 
                 transition-all duration-300 hover:border-emerald-500/30 hover:-translate-y-1"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3 md:gap-3.5">
          <div
            className="w-11 h-11 md:w-13 md:h-13 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-700 
                          flex items-center justify-center text-xl md:text-2xl"
          >
            {presale.logo}
          </div>
          <div>
            <div className="text-base md:text-lg font-semibold text-white">
              {presale.name}
            </div>
            <div className="text-xs md:text-sm text-zinc-500">
              ${presale.symbol}
            </div>
          </div>
        </div>
        <StatusBadge status={presale.status} />
      </div>

      {/* Description */}
      <p className="text-xs md:text-sm text-zinc-400 mb-4 leading-relaxed">
        {presale.description}
      </p>

      {/* Tags */}
      <div className="flex gap-1.5 mb-4 flex-wrap">
        {presale.tags.map((tag: string) => (
          <span
            key={tag}
            className="bg-zinc-800/50 px-2 py-1 rounded-md text-[11px] text-zinc-400"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Progress */}
      <PresaleProgressBar value={presale.raised} max={presale.hardCap} />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 md:gap-4 mt-4 pt-4 border-t border-zinc-800/30">
        <div>
          <div className="text-[10px] text-zinc-600 mb-1">Hard Cap</div>
          <div className="text-sm md:text-sm font-semibold">
            {presale.hardCap} ETH
          </div>
        </div>
        <div>
          <div className="text-[10px] text-zinc-600 mb-1">Liquidity</div>
          <div className="text-sm md:text-sm font-semibold">
            {presale.liquidity}%
          </div>
        </div>
        <div>
          <div className="text-[10px] text-zinc-600 mb-1">LP Lock</div>
          <div className="text-sm md:text-sm font-semibold">Permanent</div>
        </div>
      </div>
    </div>
  );
}
