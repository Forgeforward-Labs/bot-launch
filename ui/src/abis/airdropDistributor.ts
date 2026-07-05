const abi = [
  { inputs: [], name: "AmountMustBeGreaterThanZero", type: "error" },
  { inputs: [], name: "ETHTransferFailed", type: "error" },
  { inputs: [], name: "InsufficientTransferAmount", type: "error" },
  { inputs: [], name: "MismatchedInputLengths", type: "error" },
  { inputs: [], name: "NoRecipients", type: "error" },
  { inputs: [], name: "RefundFailed", type: "error" },
  { inputs: [], name: "TokenTransferFailed", type: "error" },
  {
    inputs: [
      { internalType: "address[]", name: "recipients", type: "address[]" },
      { internalType: "uint256", name: "amountEach", type: "uint256" },
    ],
    name: "distributeEther",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address[]", name: "recipients", type: "address[]" },
      { internalType: "uint256[]", name: "values", type: "uint256[]" },
    ],
    name: "distributeEtherAllocation",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "contract IERC20", name: "token", type: "address" },
      { internalType: "address[]", name: "recipients", type: "address[]" },
      { internalType: "uint256", name: "amountEach", type: "uint256" },
    ],
    name: "distributeToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "contract IERC20", name: "token", type: "address" },
      { internalType: "address[]", name: "recipients", type: "address[]" },
      { internalType: "uint256[]", name: "values", type: "uint256[]" },
    ],
    name: "distributeTokenAllocation",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export default abi;
