interface PresaleProgressBarProps {
  value: number;
  max: number;
  showLabels?: boolean;
}

export default function PresaleProgressBar({
  value,
  max,
  showLabels = true,
}: PresaleProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div>
      <div className="h-2 bg-zinc-800/80 rounded overflow-hidden">
        <div
          className={`h-full rounded transition-all duration-500 ${
            percentage >= 100
              ? "bg-gradient-to-r from-amber-400 to-amber-500"
              : "bg-gradient-to-r from-emerald-400 to-emerald-500"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabels && (
        <div className="flex justify-between mt-2 text-xs text-zinc-500">
          <span>{value.toFixed(2)} ETH</span>
          <span>{percentage.toFixed(1)}%</span>
          <span>{max} ETH</span>
        </div>
      )}
    </div>
  );
}
