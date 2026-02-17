'use client';

import { useBlockNumber, useReadContract } from 'wagmi';
import {
  PIZZA_PASS_ADDRESS,
  PIZZA_PASS_ABI,
  PIZZA_ORDER_PROCESSOR_ADDRESS,
  PIZZA_ORDER_PROCESSOR_ABI,
} from '@/contracts/addresses';

export function LiveStats() {
  const { data: blockNumber } = useBlockNumber({ watch: true });

  const { data: totalOrders } = useReadContract({
    address: PIZZA_ORDER_PROCESSOR_ADDRESS,
    abi: PIZZA_ORDER_PROCESSOR_ABI,
    functionName: 'getTotalOrders',
    args: [],
    watch: true,
  });

  // PizzaPass doesn't expose totalSupply in our ABI; we could add it or skip. Show block + orders.
  return (
    <div className="flex flex-wrap items-center gap-4 text-sm">
      <div className="bg-white/10 rounded-lg px-4 py-2 flex items-center gap-2">
        <span className="text-white/70">Block</span>
        <span className="font-mono font-bold text-green-400">
          {blockNumber !== undefined ? blockNumber.toString() : '—'}
        </span>
      </div>
      <div className="bg-white/10 rounded-lg px-4 py-2 flex items-center gap-2">
        <span className="text-white/70">Total pizza orders</span>
        <span className="font-mono font-bold">
          {totalOrders !== undefined ? totalOrders.toString() : '—'}
        </span>
      </div>
      <div className="text-white/50 text-xs">
        1s blocks · 10k TPS
      </div>
    </div>
  );
}
