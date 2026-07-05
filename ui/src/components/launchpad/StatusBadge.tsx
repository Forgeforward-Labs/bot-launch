import type { Presale } from "@/lib/launchpad-data";

const statusConfig: Record<
  Presale["status"],
  { classes: string; text: string }
> = {
  live: { classes: "bg-emerald-500/15 text-emerald-400", text: "Live" },
  upcoming: { classes: "bg-cyan-500/15 text-cyan-400", text: "Upcoming" },
  filled: { classes: "bg-amber-500/15 text-amber-400", text: "Filled" },
  finalized: { classes: "bg-purple-500/15 text-purple-400", text: "Finalized" },
  cancelled: { classes: "bg-red-500/15 text-red-400", text: "Cancelled" },
  ended: { classes: "bg-zinc-500/15 text-zinc-400", text: "Ended" },
};

export default function StatusBadge({ status }: { status: Presale["status"] }) {
  const { classes, text } = statusConfig[status] ?? statusConfig.upcoming;

  return (
    <span
      className={`${classes} px-2.5 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wide`}
    >
      {text}
    </span>
  );
}
