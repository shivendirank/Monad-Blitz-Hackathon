'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';

export function ConnectButton() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected && address) {
    return (
      <button
        onClick={() => disconnect()}
        className="px-4 py-2 rounded-full bg-white/10 text-sm hover:bg-white/20 transition"
      >
        {address.slice(0, 6)}...{address.slice(-4)} ↯
      </button>
    );
  }

  const injected = connectors[0];

  return (
    <button
      disabled={!injected || isPending}
      onClick={() => injected && connect({ connector: injected })}
      className="px-4 py-2 rounded-full bg-white text-black text-sm font-semibold hover:bg-gray-100 transition disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {isPending ? 'Connecting...' : 'Connect Wallet'}
    </button>
  );
}

