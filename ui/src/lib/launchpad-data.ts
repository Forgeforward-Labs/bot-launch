export interface Presale {
  id: number;
  name: string;
  symbol: string;
  logo: string;
  description: string;
  status: "live" | "upcoming" | "filled" | "finalized" | "cancelled" | "ended";
  softCap: number;
  hardCap: number;
  raised: number;
  presaleRate: number;
  listingRate: number;
  startTime: number;
  endTime: number;
  liquidity: number;
  lockDays: number;
  participants: number;
  tags: string[];
}

export interface WhitelistInfo {
  isWhitelisted: boolean;
  allocation: number;
  tier: string;
}

export const MOCK_PRESALES: Presale[] = [
  {
    id: 1,
    name: "NexusAI",
    symbol: "NEXAI",
    logo: "\u{1F52E}",
    description: "Decentralized AI compute network",
    status: "live",
    softCap: 50,
    hardCap: 100,
    raised: 67.5,
    presaleRate: 10000,
    listingRate: 8000,
    startTime: Date.now() - 86400000,
    endTime: Date.now() + 172800000,
    liquidity: 60,
    lockDays: 365,
    participants: 234,
    tags: ["AI", "Infrastructure"],
  },
  {
    id: 2,
    name: "MetaVault",
    symbol: "MVLT",
    logo: "\u{1F3E6}",
    description: "Cross-chain yield aggregator",
    status: "upcoming",
    softCap: 75,
    hardCap: 150,
    raised: 0,
    presaleRate: 5000,
    listingRate: 4000,
    startTime: Date.now() + 86400000,
    endTime: Date.now() + 345600000,
    liquidity: 55,
    lockDays: 180,
    participants: 0,
    tags: ["DeFi", "Yield"],
  },
  {
    id: 3,
    name: "GameFi World",
    symbol: "GFW",
    logo: "\u{1F3AE}",
    description: "Play-to-earn gaming ecosystem",
    status: "filled",
    softCap: 30,
    hardCap: 60,
    raised: 60,
    presaleRate: 25000,
    listingRate: 20000,
    startTime: Date.now() - 259200000,
    endTime: Date.now() - 86400000,
    liquidity: 51,
    lockDays: 90,
    participants: 512,
    tags: ["Gaming", "NFT"],
  },
  {
    id: 4,
    name: "ZeroGas",
    symbol: "ZGAS",
    logo: "\u26A1",
    description: "Gasless transaction relayer",
    status: "finalized",
    softCap: 40,
    hardCap: 80,
    raised: 80,
    presaleRate: 15000,
    listingRate: 12000,
    startTime: Date.now() - 604800000,
    endTime: Date.now() - 432000000,
    liquidity: 65,
    lockDays: 365,
    participants: 891,
    tags: ["Infrastructure"],
  },
  {
    id: 5,
    name: "PixelVerse",
    symbol: "PIXL",
    logo: "\u{1F3A8}",
    description: "NFT creation and marketplace platform",
    status: "live",
    softCap: 25,
    hardCap: 50,
    raised: 32.5,
    presaleRate: 20000,
    listingRate: 15000,
    startTime: Date.now() - 172800000,
    endTime: Date.now() + 86400000,
    liquidity: 55,
    lockDays: 180,
    participants: 156,
    tags: ["NFT", "Marketplace"],
  },
  {
    id: 6,
    name: "DeFiLend",
    symbol: "DLEND",
    logo: "\u{1F4B0}",
    description: "Decentralized lending and borrowing protocol",
    status: "upcoming",
    softCap: 100,
    hardCap: 200,
    raised: 0,
    presaleRate: 8000,
    listingRate: 6000,
    startTime: Date.now() + 259200000,
    endTime: Date.now() + 518400000,
    liquidity: 60,
    lockDays: 365,
    participants: 0,
    tags: ["DeFi", "Lending"],
  },
  {
    id: 7,
    name: "SocialFi Hub",
    symbol: "SHUB",
    logo: "\u{1F4AC}",
    description: "Decentralized social media platform",
    status: "live",
    softCap: 35,
    hardCap: 70,
    raised: 58.1,
    presaleRate: 12000,
    listingRate: 9500,
    startTime: Date.now() - 345600000,
    endTime: Date.now() + 43200000,
    liquidity: 52,
    lockDays: 120,
    participants: 423,
    tags: ["Social", "Infrastructure"],
  },
  {
    id: 8,
    name: "ChainOracle",
    symbol: "CORC",
    logo: "\u{1F517}",
    description: "Decentralized oracle network for smart contracts",
    status: "finalized",
    softCap: 60,
    hardCap: 120,
    raised: 120,
    presaleRate: 7500,
    listingRate: 6000,
    startTime: Date.now() - 864000000,
    endTime: Date.now() - 691200000,
    liquidity: 58,
    lockDays: 365,
    participants: 1247,
    tags: ["Infrastructure", "Oracle"],
  },
];

export const AVAILABLE_TAGS = [
  "AI",
  "Infrastructure",
  "DeFi",
  "Yield",
  "Gaming",
  "NFT",
  "Marketplace",
  "Lending",
  "Social",
  "Oracle",
];

export const MOCK_WHITELIST: WhitelistInfo = {
  isWhitelisted: true,
  allocation: 2.0,
  tier: "Gold",
};
