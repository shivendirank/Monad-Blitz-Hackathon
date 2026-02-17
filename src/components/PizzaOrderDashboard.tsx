'use client';

import { useEffect, useState } from 'react';
import { useWatchBlockNumber, useReadContract } from 'wagmi';
import {
  PIZZA_ORDER_PROCESSOR_ADDRESS,
  PIZZA_ORDER_PROCESSOR_ABI,
} from '@/contracts/addresses';

interface BlockStats {
  blockNumber: number;
  orderCount: number;
  timestamp: number;
}

const PIZZA_EMOJIS = ['🍕', '🧀', '🍍', '🍗', '🌟', '🥦'];

export function PizzaOrderDashboard() {
  const [recentBlocks, setRecentBlocks] = useState<BlockStats[]>([]);
  const [totalOrders, setTotalOrders] = useState(0);

  // Live total orders
  const { data: orders } = useReadContract({
    address: PIZZA_ORDER_PROCESSOR_ADDRESS,
    abi: PIZZA_ORDER_PROCESSOR_ABI,
    functionName: 'getTotalOrders',
    args: [],
    watch: true,
  });

  useEffect(() => {
    if (orders) setTotalOrders(Number(orders));
  }, [orders]);

  // Per-block order counts
  useWatchBlockNumber({
    onBlockNumber: async (blockNumber) => {
      // For each new block, fetch order count from contract
      try {
        const result = (await window.ethereum?.request({
          method: 'eth_call',
          params: [],
        })) as unknown;
        // NOTE: For a real build, replace this with viem readContract call,
        // or a custom hook that calls getBlockStats(blockNumber).
      } catch {
        // swallow for demo
      }

      setRecentBlocks((prev) => {
        const next: BlockStats = {
          blockNumber: Number(blockNumber),
          orderCount: Math.floor(Math.random() * 20), // placeholder visual
          timestamp: Date.now(),
        };
        return [next, ...prev].slice(0, 5);
      });
    },
  });

  return (
    <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-2xl">
      <h2 className="text-3xl font-bold mb-6">
        🍕 Live Pizza Orders (Parallel Execution)
      </h2>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white/10 rounded-lg p-4">
          <div className="text-sm opacity-80">Total Orders</div>
          <div className="text-4xl font-bold">{totalOrders}</div>
        </div>
        <div className="bg-white/10 rounded-lg p-4">
          <div className="text-sm opacity-80">Orders This Block</div>
          <div className="text-4xl font-bold">
            {recentBlocks[0]?.orderCount || 0}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-bold text-lg mb-3">Recent Blocks</h3>
        {recentBlocks.map((block, idx) => (
          <div
            key={block.blockNumber}
            className="bg-white/10 rounded-lg p-3 flex items-center justify-between"
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
            <div className="flex items-center gap-3">
              <div className="font-mono text-sm">#{block.blockNumber}</div>
              <div className="flex gap-1">
                {Array(block.orderCount)
                  .fill(0)
                  .map((_, i) => (
                    <span key={i} className="text-xl">
                      {PIZZA_EMOJIS[i % PIZZA_EMOJIS.length]}
                    </span>
                  ))}
              </div>
            </div>
            <div className="text-sm opacity-80">
              {block.orderCount} orders in 1 block
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

