import type { Presale } from "@/lib/launchpad-data";
import StatusBadge from "./StatusBadge";
import PresaleProgressBar from "./PresaleProgressBar";

interface PresaleCardProps {
  presale: Presale;
  onClick: () => void;
}

export default function PresaleCard({ presale, onClick }: PresaleCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-gradient-to-br from-zinc-900/60 to-zinc-900/30 rounded-2xl border border-zinc-700/40 p-5 md:p-6 cursor-pointer transition-all duration-300 hover:border-emerald-500/30 hover:-translate-y-1"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3 md:gap-3.5">
          <div className="w-11 h-11 md:w-[52px] md:h-[52px] rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-800 flex items-center justify-center text-xl md:text-2xl overflow-hidden">
            {presale.logo?.startsWith("http") ? (
              <img src={presale.logo} alt="" className="w-full h-full object-cover" />
            ) : (
              presale.logo || "🚀"
            )}
          </div>
          <div>
            <div className="text-base md:text-lg font-semibold text-white">
              {presale.name}
            </div>
            <div className="text-xs md:text-[13px] text-zinc-500">
              ${presale.symbol}
            </div>
          </div>
        </div>
        <StatusBadge status={presale.status} />
      </div>

      <p className="text-xs md:text-[13px] text-zinc-400 mb-4 leading-relaxed">
        {presale.description}
      </p>

      <div className="flex gap-1.5 mb-4 flex-wrap">
        {presale.tags.map((tag) => (
          <span
            key={tag}
            className="bg-zinc-800/50 px-2 py-1 rounded-md text-[11px] text-zinc-400"
          >
            {tag}
          </span>
        ))}
      </div>

      <PresaleProgressBar value={presale.raised} max={presale.hardCap} />

      <div className="grid grid-cols-3 gap-3 md:gap-4 mt-4 pt-4 border-t border-zinc-700/30">
        <div>
          <div className="text-[10px] text-zinc-600 mb-1">Hard Cap</div>
          <div className="text-[13px] md:text-sm font-semibold text-white">
            {presale.hardCap} BOT
          </div>
        </div>
        <div>
          <div className="text-[10px] text-zinc-600 mb-1">Liquidity</div>
          <div className="text-[13px] md:text-sm font-semibold text-white">
            {presale.liquidity}%
          </div>
        </div>
        <div>
          <div className="text-[10px] text-zinc-600 mb-1">LP Lock</div>
          <div className="text-[13px] md:text-sm font-semibold text-white">
            Permanent
          </div>
        </div>
      </div>
    </div>
  );
}
