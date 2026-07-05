const abi = [
  {
    inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
    name: "buy",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "bytes32[]", name: "proof", type: "bytes32[]" },
    ],
    name: "buyWithWhitelist",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "casher", type: "address" }],
    name: "finalizeSale",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_participant", type: "address" },
    ],
    name: "getParticipant",
    outputs: [
      {
        components: [
          { internalType: "address", name: "participant", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
          {
            internalType: "enum Sales.ParticipantStatus",
            name: "status",
            type: "uint8",
          },
        ],
        internalType: "struct Sales.Participant",
        name: "participant",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getSaleData",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "startTime", type: "uint256" },
          { internalType: "uint256", name: "endTime", type: "uint256" },
          { internalType: "uint256", name: "softCap", type: "uint256" },
          { internalType: "uint256", name: "hardCap", type: "uint256" },
          { internalType: "uint256", name: "maxBuy", type: "uint256" },
          { internalType: "uint256", name: "saleSold", type: "uint256" },
          {
            internalType: "uint256",
            name: "totalTokensForSale",
            type: "uint256",
          },
          { internalType: "bytes", name: "salesJson", type: "bytes" },
          {
            internalType: "uint256",
            name: "totalTokensForLiquidity",
            type: "uint256",
          },
          { internalType: "uint8", name: "liquidityBPS", type: "uint8" },
        ],
        internalType: "struct Sales.SaleData",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "tokenData",
    outputs: [
      { internalType: "address", name: "tokenAddress", type: "address" },
      { internalType: "uint8", name: "tokenDecimals", type: "uint8" },
      { internalType: "string", name: "tokenSymbol", type: "string" },
      { internalType: "string", name: "tokenName", type: "string" },
      {
        internalType: "uint256",
        name: "tokenTotalSupply",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "buyer",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "ethAmount",
        type: "uint256",
      },
    ],
    name: "TokensPurchased",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "claimer",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "tokenAmount",
        type: "uint256",
      },
    ],
    name: "TokensClaimed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "participant",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "ethAmount",
        type: "uint256",
      },
    ],
    name: "Refunded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "totalSold",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "liquidityAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "treasuryAmount",
        type: "uint256",
      },
    ],
    name: "SaleFinalized",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_whitelistRootHash",
        type: "bytes32",
      },
    ],
    name: "setWhitelist",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_whitelistStartTime",
        type: "uint256",
      },
      { internalType: "uint16", name: "_duration", type: "uint16" },
    ],
    name: "setWhitelistDuration",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export default abi;
