'use client';

import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { PIZZA_PASS_ABI, PIZZA_PASS_ADDRESS } from '@/contracts/addresses';

export function PizzaPassMint() {
  const [imageUrl, setImageUrl] = useState('');
  const { address } = useAccount();
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash });

  const handleMint = () => {
    if (!imageUrl || !address) return;

    writeContract({
      address: PIZZA_PASS_ADDRESS,
      abi: PIZZA_PASS_ABI,
      functionName: 'mintPass',
      args: [imageUrl],
    });
  };

  const disabled = isPending || isConfirming || !imageUrl || !address;

  return (
    <div className="bg-gradient-to-br from-orange-500 to-pink-500 rounded-2xl p-8 shadow-xl max-w-md w-full">
      <h2 className="text-3xl font-bold text-white mb-4">🍕 Get Your Pizza Pass</h2>
      <p className="text-white/90 mb-6">
        Paste a pizza receipt image URL to mint your soulbound entry ticket.
      </p>

      <input
        type="text"
        placeholder="Pizza receipt image URL (or base64)"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        className="w-full px-4 py-3 rounded-lg mb-4 text-black placeholder:text-gray-500"
      />

      <button
        onClick={handleMint}
        disabled={disabled}
        className="w-full bg-white text-orange-600 font-bold py-3 rounded-lg hover:bg-orange-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isConfirming ? '🍕 Minting...' : isPending ? '⏳ Waiting for wallet...' : '🍕 Mint Pizza Pass'}
      </button>

      {!address && (
        <p className="mt-3 text-sm text-white/80">
          Connect a wallet to mint your Pizza Pass.
        </p>
      )}
    </div>
  );
}

