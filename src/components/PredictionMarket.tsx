'use client';

import { useState } from 'react';
import { parseEther } from 'viem';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import {
  PREDICTION_MARKET_ADDRESS,
  PREDICTION_MARKET_ABI,
  PIZZA_PASS_ADDRESS,
  PIZZA_PASS_ABI,
} from '@/contracts/addresses';

function TeamOption({ teamId }: { teamId: number }) {
  const { data } = useReadContract({
    address: PREDICTION_MARKET_ADDRESS,
    abi: PREDICTION_MARKET_ABI,
    functionName: 'getTeamInfo',
    args: [BigInt(teamId)],
  });
  const name = data ? data[0] : `Team ${teamId}`;
  return <option value={teamId} className="bg-gray-900 text-white">{name}</option>;
}

export function PredictionMarket() {
  const [selectedTeamId, setSelectedTeamId] = useState<number>(0);
  const [betAmount, setBetAmount] = useState('');

  const { address } = useAccount();
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash });

  const { data: hasPass } = useReadContract({
    address: PIZZA_PASS_ADDRESS,
    abi: PIZZA_PASS_ABI,
    functionName: 'hasPass',
    args: address ? [address] : undefined,
  });

  const { data: teamCount } = useReadContract({
    address: PREDICTION_MARKET_ADDRESS,
    abi: PREDICTION_MARKET_ABI,
    functionName: 'getTeamCount',
    args: [],
  });

  const { data: marketResolved } = useReadContract({
    address: PREDICTION_MARKET_ADDRESS,
    abi: PREDICTION_MARKET_ABI,
    functionName: 'resolved',
    args: [],
  });

  const { data: totalPot } = useReadContract({
    address: PREDICTION_MARKET_ADDRESS,
    abi: PREDICTION_MARKET_ABI,
    functionName: 'totalPot',
    args: [],
  });

  const { data: winningTeamId } = useReadContract({
    address: PREDICTION_MARKET_ADDRESS,
    abi: PREDICTION_MARKET_ABI,
    functionName: 'winningTeamId',
    args: [],
  });

  const { data: myBet } = useReadContract({
    address: PREDICTION_MARKET_ADDRESS,
    abi: PREDICTION_MARKET_ABI,
    functionName: 'bets',
    args: address ? [address] : undefined,
  });

  const numTeams = teamCount !== undefined ? Number(teamCount) : 0;
  const resolved = marketResolved === true;
  const myBetAmount = myBet ? myBet[0] : 0n;
  const myBetTeamId = myBet ? Number(myBet[1]) : -1;
  const isWinner = resolved && myBetTeamId >= 0 && winningTeamId !== undefined && myBetTeamId === Number(winningTeamId);

  const placeBet = () => {
    if (!address || !betAmount || numTeams === 0) return;
    try {
      const wei = parseEther(betAmount);
      if (wei <= 0n) return;
      writeContract({
        address: PREDICTION_MARKET_ADDRESS,
        abi: PREDICTION_MARKET_ABI,
        functionName: 'placeBet',
        args: [BigInt(selectedTeamId)],
        value: wei,
      });
    } catch {
      // invalid amount
    }
  };

  const claimWinnings = () => {
    writeContract({
      address: PREDICTION_MARKET_ADDRESS,
      abi: PREDICTION_MARKET_ABI,
      functionName: 'claimWinnings',
      args: [],
    });
  };

  return (
    <div className="bg-gradient-to-br from-amber-600 to-orange-700 rounded-2xl p-6 text-white shadow-xl">
      <h2 className="text-2xl font-bold mb-2">🏆 Hackathon Winner Prediction</h2>
      <p className="text-sm text-white/90 mb-4">
        Bet on which team wins. Requires a Pizza Pass. One bet per wallet.
      </p>

      {totalPot !== undefined && (
        <div className="bg-white/10 rounded-lg p-3 mb-4">
          <span className="text-sm opacity-90">Total pot:</span>{' '}
          <span className="font-bold">{(Number(totalPot) / 1e18).toFixed(4)} MON</span>
          {resolved && winningTeamId !== undefined && (
            <p className="text-sm mt-1">Winning team ID: {Number(winningTeamId)}</p>
          )}
        </div>
      )}

      {!address && (
        <p className="text-sm text-white/80 py-2">Connect your wallet to bet or claim.</p>
      )}

      {address && !hasPass && (
        <p className="text-sm text-amber-200 py-2">Mint a Pizza Pass first to place a bet.</p>
      )}

      {address && hasPass && numTeams > 0 && !resolved && myBetAmount === 0n && (
        <div className="space-y-3">
          <label className="block text-sm font-medium">Select team</label>
          <select
            value={selectedTeamId}
            onChange={(e) => setSelectedTeamId(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-lg bg-white/10 text-white border border-white/20"
          >
            {Array.from({ length: numTeams }, (_, i) => (
              <TeamOption key={i} teamId={i} />
            ))}
          </select>
          <input
            type="number"
            min="0"
            step="0.001"
            placeholder="Amount (MON)"
            value={betAmount}
            onChange={(e) => setBetAmount(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-white/10 text-white placeholder:text-white/60 border border-white/20"
          />
          <button
            onClick={placeBet}
            disabled={isPending || isConfirming || !betAmount}
            className="w-full bg-white text-amber-700 font-bold py-2 rounded-lg hover:bg-amber-50 transition disabled:opacity-50"
          >
            {isConfirming ? 'Placing bet...' : isPending ? 'Confirm in wallet...' : 'Place bet'}
          </button>
        </div>
      )}

      {address && myBetAmount > 0n && !resolved && (
        <p className="text-sm text-white/90 py-2">
          Your bet: {(Number(myBetAmount) / 1e18).toFixed(4)} MON on team {myBetTeamId}. Wait for market resolution.
        </p>
      )}

      {address && resolved && isWinner && (
        <div className="space-y-2">
          <p className="text-green-200 font-semibold">You won! Claim your share of the pot.</p>
          <button
            onClick={claimWinnings}
            disabled={isPending || isConfirming}
            className="w-full bg-green-500 text-white font-bold py-2 rounded-lg hover:bg-green-600 disabled:opacity-50"
          >
            {isConfirming ? 'Claiming...' : isPending ? 'Confirm...' : 'Claim winnings'}
          </button>
        </div>
      )}

      {address && resolved && !isWinner && myBetAmount > 0n && (
        <p className="text-white/80 py-2">Your team didn’t win this time. Better luck next hackathon!</p>
      )}

      {numTeams === 0 && (
        <p className="text-sm text-white/80 py-2">No teams yet. Admin can add teams from the control panel.</p>
      )}
    </div>
  );
}
