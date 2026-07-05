const abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "saleAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "saleOwner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "token",
        type: "address",
      },
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
        indexed: false,
        internalType: "struct Sales.SaleData",
        name: "saleData",
        type: "tuple",
      },
    ],
    name: "SaleCreated",
    type: "event",
  },
  {
    inputs: [
      { internalType: "address", name: "token", type: "address" },
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
        name: "_saleData",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "address",
            name: "tokenAddress",
            type: "address",
          },
          { internalType: "uint8", name: "tokenDecimals", type: "uint8" },
          { internalType: "string", name: "tokenSymbol", type: "string" },
          { internalType: "string", name: "tokenName", type: "string" },
          {
            internalType: "uint256",
            name: "tokenTotalSupply",
            type: "uint256",
          },
        ],
        internalType: "struct Sales.TokenData",
        name: "_tokenData",
        type: "tuple",
      },
    ],
    name: "createSale",
    outputs: [
      { internalType: "address", name: "saleAddress", type: "address" },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllSales",
    outputs: [{ internalType: "address[]", name: "", type: "address[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "getSalesByOwner",
    outputs: [{ internalType: "address[]", name: "", type: "address[]" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

export default abi;
