import { type ChangeEvent } from "react";

interface FormInputProps {
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  suffix?: string;
  rows?: number;
}

export default function FormInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
  suffix,
  rows,
}: FormInputProps) {
  return (
    <div className="mb-5">
      <label className="block text-sm text-zinc-400 mb-2">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      <div className="relative">
        {rows ? (
          <textarea
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
            className="w-full bg-zinc-900/80 border border-zinc-700/50 rounded-xl px-3.5 py-3 text-white text-sm outline-none focus:border-emerald-500/50 placeholder:text-zinc-600 resize-none"
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`w-full bg-zinc-900/80 border border-zinc-700/50 rounded-xl px-3.5 py-3 text-white text-sm outline-none focus:border-emerald-500/50 placeholder:text-zinc-600 ${
              suffix ? "pr-16" : ""
            } ${type === "date" || type === "time" ? "[color-scheme:dark]" : ""}`}
          />
        )}
        {suffix && !rows && (
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-zinc-500">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}
