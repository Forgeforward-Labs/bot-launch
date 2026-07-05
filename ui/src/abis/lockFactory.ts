const abi = [
  { inputs: [], name: "InvalidEndTime", type: "error" },
  { inputs: [], name: "TransferFailed", type: "error" },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "lock", type: "address" },
      {
        indexed: true,
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "lockingAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "lockTimeEnd",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "projectImageUrl",
        type: "string",
      },
    ],
    name: "LockCreated",
    type: "event",
  },
  {
    inputs: [
      { internalType: "address", name: "_token", type: "address" },
      { internalType: "address", name: "_owner", type: "address" },
      { internalType: "uint256", name: "_lockingAmount", type: "uint256" },
      { internalType: "uint256", name: "_lockTimeEnd", type: "uint256" },
      { internalType: "string", name: "_projectImageUrl", type: "string" },
    ],
    name: "createLock",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "payable",
    type: "function",
  },
];

export default abi;
