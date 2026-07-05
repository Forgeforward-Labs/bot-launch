import type { Presale } from "@/lib/launchpad-data";
import StatusBadge from "./StatusBadge";

interface PresaleListItemProps {
  presale: Presale;
  onClick: () => void;
}

export default function PresaleListItem({
  presale,
  onClick,
}: PresaleListItemProps) {
  const percentage = Math.min(
    (presale.raised / presale.hardCap) * 100,
    100
  );

  return (
    <div
      onClick={onClick}
      className="bg-gradient-to-br from-zinc-900/60 to-zinc-900/30 rounded-xl border border-zinc-700/40 p-4 md:p-5 cursor-pointer transition-all duration-300 hover:border-emerald-500/30 flex items-center gap-4"
    >
      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-800 flex items-center justify-center text-xl flex-shrink-0">
        {presale.logo}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-white">{presale.name}</span>
          <span className="text-xs text-zinc-500">${presale.symbol}</span>
        </div>
        <p className="text-xs text-zinc-400 truncate">{presale.description}</p>
      </div>
      <div className="hidden md:block w-32">
        <div className="h-1.5 bg-zinc-800/80 rounded overflow-hidden">
          <div
            className={`h-full rounded ${
              percentage >= 100
                ? "bg-gradient-to-r from-amber-400 to-amber-500"
                : "bg-gradient-to-r from-emerald-400 to-emerald-500"
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="text-[10px] text-zinc-500 mt-1">
          {presale.raised}/{presale.hardCap} ETH
        </div>
      </div>
      <div className="hidden md:block text-right text-xs text-zinc-500">
        {presale.participants} users
      </div>
      <StatusBadge status={presale.status} />
    </div>
  );
}
