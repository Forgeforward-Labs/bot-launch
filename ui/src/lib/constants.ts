import { getAddress } from 'viem';
import { useAccount } from 'wagmi';
import { botChainTestnet, botChainMainnet } from './chains';

const ADDRESSES = {
  [botChainTestnet.id]: {
    tokenFactory: getAddress('0x2284Cff73d2384fDF91E84060d40A41581E642Ac'),
    lockFactory: getAddress('0x0ff13de01a0cac7cbe377fffe3992086a6bc1e72'),
    salesFactory: getAddress('0xee438609d158a6406bc237ebae82fd5c748e2154'),
    airdropDistributor: getAddress('0x592B56644ca7adb298Ec373eC10a36f435b9f410'),
  },
  [botChainMainnet.id]: {
    tokenFactory: getAddress('0x2284cff73d2384fdf91e84060d40a41581e642ac'),
    lockFactory: getAddress('0x03a901a563fcd2692046ffd08a510f0246253596'),
    salesFactory: getAddress('0x2617c66707d40b33a869b1dbb392b6fa5ca1d156'),
    airdropDistributor: getAddress('0x592B56644ca7adb298Ec373eC10a36f435b9f410'),
  },
} as const;

export const useContractAddresses = () => {
  const { chainId } = useAccount();
  return ADDRESSES[chainId as keyof typeof ADDRESSES] ?? ADDRESSES[botChainTestnet.id];
};
