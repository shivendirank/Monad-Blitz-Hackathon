'use client';

import { useEffect, useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import { REFLEX_GAME_ABI, REFLEX_GAME_ADDRESS } from '@/contracts/addresses';

type GameState = 'waiting' | 'countdown' | 'active' | 'ended';

export function ReflexGame() {
  const [gameState, setGameState] = useState<GameState>('waiting');
  const [countdown, setCountdown] = useState(10);
  const [reactionTime, setReactionTime] = useState<number | null>(null);

  const { address } = useAccount();
  const { writeContract, isPending } = useWriteContract();

  // NOTE: In a real build, this should be wired to a viem/wagmi
  // watchEvent listener for RoundStarted / RoundEnded events.
  useEffect(() => {
    if (gameState !== 'waiting') return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setGameState('countdown');

          // simulate red -> green transition after random delay
          setTimeout(() => {
            setGameState('active');
          }, 1000);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState]);

  const handleClick = () => {
    if (gameState !== 'active' || !address) return;

    const now = Date.now();
    setReactionTime(now); // For demo we just store timestamp; real time comes from event.

    writeContract({
      address: REFLEX_GAME_ADDRESS,
      abi: REFLEX_GAME_ABI,
      functionName: 'submitReaction',
      args: [],
    });

    setGameState('ended');
  };

  return (
    <div className="relative w-full h-96 flex items-center justify-center">
      {gameState === 'waiting' && (
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold mb-2">⚡ Monad Reflex</h2>
          <p className="text-xl mb-4 text-white/80">
            Get ready for the 500ms reaction challenge.
          </p>
          <div className="text-6xl font-mono">{countdown}s</div>
          {!address && (
            <p className="text-sm text-white/70 mt-2">
              Connect your wallet and mint a Pizza Pass to play.
            </p>
          )}
        </div>
      )}

      {gameState === 'countdown' && (
        <div className="w-64 h-64 bg-red-500 rounded-full flex items-center justify-center animate-pulse shadow-2xl">
          <span className="text-white text-6xl font-bold">WAIT</span>
        </div>
      )}

      {gameState === 'active' && (
        <button
          onClick={handleClick}
          disabled={isPending || !address}
          className="w-64 h-64 bg-green-500 rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-2xl cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <span className="text-white text-6xl font-bold">
            {isPending ? '...' : 'CLICK!'}
          </span>
        </button>
      )}

      {gameState === 'ended' && reactionTime && (
        <div className="text-center">
          <h3 className="text-3xl font-bold mb-4">Nice reflex! ⚡</h3>
          <div className="text-5xl font-mono text-green-400">
            {/* Placeholder display; real demo would show on-chain winTime */}
            &lt; 500ms
          </div>
          <p className="mt-4 text-white/70">
            On Monad, thousands of players can submit reactions in the same second.
          </p>
        </div>
      )}
    </div>
  );
}

