import { http, createConfig } from 'wagmi';
import type { Chain } from 'wagmi/chains';

// TODO: Replace with actual Monad testnet details
export const monadTestnet = {
  id: 1,
  name: 'Monad Testnet',
  nativeCurrency: {
    name: 'MON',
    symbol: 'MON',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ['https://rpc.monad.example'] },
    public: { http: ['https://rpc.monad.example'] },
  },
} as const satisfies Chain;

export const wagmiConfig = createConfig({
  chains: [monadTestnet],
  transports: {
    [monadTestnet.id]: http(monadTestnet.rpcUrls.default.http[0]),
  },
});

