import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const shortenAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const convertTimestampToDate = (timestamp: number) => {
  return new Date(timestamp * 1000).toLocaleString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
};
