'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useWriteContract } from 'wagmi';
import {
  REFLEX_GAME_ADDRESS,
  REFLEX_GAME_ABI,
  PIZZA_ORDER_PROCESSOR_ADDRESS,
  PIZZA_ORDER_PROCESSOR_ABI,
  PREDICTION_MARKET_ADDRESS,
  PREDICTION_MARKET_ABI,
} from '@/contracts/addresses';
import { ConnectButton } from '@/components/ConnectButton';

export default function AdminPanel() {
  const [windowMs, setWindowMs] = useState(500);
  const [newTeamName, setNewTeamName] = useState('');
  const [winningTeamId, setWinningTeamId] = useState('0');
  const { writeContract, isPending } = useWriteContract();

  const startReflexRound = () => {
    writeContract({
      address: REFLEX_GAME_ADDRESS,
      abi: REFLEX_GAME_ABI,
      functionName: 'startRound',
      args: [BigInt(windowMs)],
    });
  };

  const endReflexRound = () => {
    writeContract({
      address: REFLEX_GAME_ADDRESS,
      abi: REFLEX_GAME_ABI,
      functionName: 'endRound',
      args: [],
    });
  };

  const batchPizzaOrders = async () => {
    const addresses = Array.from({ length: 15 }, () =>
      `0x${Math.random().toString(16).slice(2, 42).padEnd(40, '0')}`,
    );
    const types = Array.from({ length: 15 }, () => Math.floor(Math.random() * 6));

    await writeContract({
      address: PIZZA_ORDER_PROCESSOR_ADDRESS,
      abi: PIZZA_ORDER_PROCESSOR_ABI,
      functionName: 'batchProcessOrders',
      args: [addresses as `0x${string}`[], types],
    });
  };

  const addTeam = () => {
    if (!newTeamName.trim()) return;
    writeContract({
      address: PREDICTION_MARKET_ADDRESS,
      abi: PREDICTION_MARKET_ABI,
      functionName: 'addTeam',
      args: [newTeamName.trim()],
    });
    setNewTeamName('');
  };

  const resolveMarket = () => {
    writeContract({
      address: PREDICTION_MARKET_ADDRESS,
      abi: PREDICTION_MARKET_ABI,
      functionName: 'resolveMarket',
      args: [BigInt(winningTeamId)],
    });
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <header className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <Link href="/" className="text-4xl font-bold hover:opacity-90">🎮 Demo Control Panel</Link>
        <ConnectButton />
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="bg-gray-900 rounded-lg p-6 space-y-4">
          <h2 className="text-2xl font-bold">Reflex Game Controls</h2>
          <p className="text-sm text-gray-400">
            Trigger global rounds while the audience watches the arena screen.
          </p>
          <div className="flex gap-4 items-center">
            <input
              type="number"
              value={windowMs}
              onChange={(e) => setWindowMs(Number(e.target.value))}
              className="bg-gray-800 px-4 py-2 rounded w-32"
              placeholder="Window (ms)"
            />
            <button
              onClick={startReflexRound}
              disabled={isPending}
              className="bg-green-600 px-6 py-2 rounded font-bold hover:bg-green-700 disabled:opacity-60"
            >
              Start Round
            </button>
            <button
              onClick={endReflexRound}
              disabled={isPending}
              className="bg-red-600 px-6 py-2 rounded font-bold hover:bg-red-700 disabled:opacity-60"
            >
              End Round
            </button>
          </div>
        </section>

        <section className="bg-gray-900 rounded-lg p-6 space-y-3">
          <h2 className="text-2xl font-bold">Pizza Order Simulation</h2>
          <p className="text-sm text-gray-400">
            Fire a batch of 15 pizza orders in a single transaction to
            demonstrate Monad&apos;s parallel execution.
          </p>
          <button
            onClick={batchPizzaOrders}
            disabled={isPending}
            className="bg-purple-600 px-6 py-3 rounded font-bold hover:bg-purple-700 disabled:opacity-60"
          >
            🍕 Batch Process 15 Orders
          </button>
        </section>

        <section className="bg-gray-900 rounded-lg p-6 space-y-4 md:col-span-2">
          <h2 className="text-2xl font-bold">Prediction Market</h2>
          <p className="text-sm text-gray-400">
            Add hackathon teams, then resolve the market with the winning team ID after the event.
          </p>
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <label className="block text-xs text-gray-500 mb-1">New team name</label>
              <input
                type="text"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                placeholder="Team name"
                className="bg-gray-800 px-4 py-2 rounded w-48"
              />
            </div>
            <button
              onClick={addTeam}
              disabled={isPending || !newTeamName.trim()}
              className="bg-amber-600 px-6 py-2 rounded font-bold hover:bg-amber-700 disabled:opacity-60"
            >
              Add Team
            </button>
            <div className="flex gap-2 items-end">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Winning team ID</label>
                <input
                  type="number"
                  min="0"
                  value={winningTeamId}
                  onChange={(e) => setWinningTeamId(e.target.value)}
                  className="bg-gray-800 px-4 py-2 rounded w-24"
                />
              </div>
              <button
                onClick={resolveMarket}
                disabled={isPending}
                className="bg-green-600 px-6 py-2 rounded font-bold hover:bg-green-700 disabled:opacity-60"
              >
                Resolve Market
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

