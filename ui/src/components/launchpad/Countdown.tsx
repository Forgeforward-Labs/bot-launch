import { useState, useEffect } from "react";

interface CountdownProps {
  endTime: number;
}

export default function Countdown({ endTime }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const diff = endTime - Date.now();

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  if (endTime - Date.now() <= 0) {
    return <span className="text-zinc-500">Ended</span>;
  }

  const units = [
    { value: timeLeft.days, label: "D" },
    { value: timeLeft.hours, label: "H" },
    { value: timeLeft.minutes, label: "M" },
    { value: timeLeft.seconds, label: "S" },
  ];

  return (
    <div className="flex gap-3">
      {units.map((item, i) => (
        <div key={i} className="text-center">
          <div className="bg-zinc-800/50 rounded-lg px-3 py-2 text-lg font-bold font-mono text-white min-w-[48px]">
            {String(item.value).padStart(2, "0")}
          </div>
          <div className="text-[10px] text-zinc-600 mt-1">{item.label}</div>
        </div>
      ))}
    </div>
  );
}
