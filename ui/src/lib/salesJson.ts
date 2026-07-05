export interface SalesJsonMeta {
  name: string;
  symbol: string;
  description: string;
  logoUrl?: string;
  tags?: string[];
  website?: string;
  twitter?: string;
}

/** Decode salesJson from hex bytes string to metadata object */
export function decodeSalesJson(hexOrStr: string): SalesJsonMeta | null {
  try {
    let jsonStr: string;
    if (hexOrStr.startsWith("0x")) {
      const hex = hexOrStr.slice(2);
      const bytes = new Uint8Array(
        hex.match(/.{1,2}/g)!.map((b) => parseInt(b, 16))
      );
      jsonStr = new TextDecoder().decode(bytes);
    } else {
      jsonStr = hexOrStr;
    }
    return JSON.parse(jsonStr) as SalesJsonMeta;
  } catch {
    return null;
  }
}

/** Encode metadata object to hex bytes for the contract */
export function encodeSalesJson(meta: SalesJsonMeta): `0x${string}` {
  const jsonStr = JSON.stringify(meta);
  const bytes = new TextEncoder().encode(jsonStr);
  const hex = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `0x${hex}`;
}

/** Format BigInt wei to ETH with given decimals */
export function formatEth(wei: bigint, decimals = 4): string {
  const eth = Number(wei) / 1e18;
  return eth.toFixed(decimals);
}

/** Compute presale status from on-chain data */
export function computePresaleStatus(
  startTime: bigint,
  endTime: bigint,
  saleSold: bigint,
  hardCap: bigint,
  indexerStatus: string
): "live" | "upcoming" | "filled" | "finalized" | "ended" {
  if (indexerStatus === "FINALIZED") return "finalized";
  const now = BigInt(Math.floor(Date.now() / 1000));
  if (now < startTime) return "upcoming";
  if (saleSold >= hardCap) return "filled";
  if (now > endTime) return "ended";
  return "live";
}
