// Wallet service for managing user balance and tokens

export interface WalletState {
  balance: number;
  earned: number;
  confessions: number;
  replies: number;
  userAddress: string | null;
}

const WALLET_STORAGE_KEY = 'pizzatom_wallet_';
const INITIAL_BALANCE = 3; // Every user starts with 3 tokens

export const walletService = {
  /**
   * Get or create wallet for a user
   * Uses a mock address since users don't connect wallets
   */
  getOrCreateWallet(sessionId: string): WalletState {
    const storageKey = `${WALLET_STORAGE_KEY}${sessionId}`;
    const stored = localStorage.getItem(storageKey);

    if (stored) {
      return JSON.parse(stored);
    }

    // Generate a pseudo-random address for this session
    const mockAddress = `0x${sessionId.slice(0, 40).padEnd(40, '0')}`;

    const wallet: WalletState = {
      balance: INITIAL_BALANCE,
      earned: 0,
      confessions: 0,
      replies: 0,
      userAddress: mockAddress,
    };

    localStorage.setItem(storageKey, JSON.stringify(wallet));
    return wallet;
  },

  /**
   * Update wallet after confession posted
   */
  async mintConfession(sessionId: string, confessionId: string): Promise<WalletState> {
    const wallet = this.getOrCreateWallet(sessionId);
    const reward = 50;

    try {
      // Call backend API to mint on-chain
      const response = await fetch('/api/confessions/mint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userAddress: wallet.userAddress,
          confessionId,
          type: 'confession',
        }),
      });

      const result = await response.json();

      if (result.success || result.fallback) {
        // Update local wallet
        wallet.balance += reward;
        wallet.earned += reward;
        wallet.confessions += 1;
        localStorage.setItem(`${WALLET_STORAGE_KEY}${sessionId}`, JSON.stringify(wallet));
        return wallet;
      }

      throw new Error(result.message || 'Failed to mint tokens');
    } catch (error) {
      console.error('Minting error:', error);
      // Still update local balance as fallback
      wallet.balance += reward;
      wallet.earned += reward;
      wallet.confessions += 1;
      localStorage.setItem(`${WALLET_STORAGE_KEY}${sessionId}`, JSON.stringify(wallet));
      return wallet;
    }
  },

  /**
   * Update wallet after reply posted
   */
  async mintReply(sessionId: string, replyId: string): Promise<WalletState> {
    const wallet = this.getOrCreateWallet(sessionId);
    const reward = 25;

    try {
      // Call backend API to mint on-chain
      const response = await fetch('/api/confessions/mint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userAddress: wallet.userAddress,
          replyId,
          type: 'reply',
        }),
      });

      const result = await response.json();

      if (result.success || result.fallback) {
        // Update local wallet
        wallet.balance += reward;
        wallet.earned += reward;
        wallet.replies += 1;
        localStorage.setItem(`${WALLET_STORAGE_KEY}${sessionId}`, JSON.stringify(wallet));
        return wallet;
      }

      throw new Error(result.message || 'Failed to mint tokens');
    } catch (error) {
      console.error('Minting error:', error);
      // Still update local balance as fallback
      wallet.balance += reward;
      wallet.earned += reward;
      wallet.replies += 1;
      localStorage.setItem(`${WALLET_STORAGE_KEY}${sessionId}`, JSON.stringify(wallet));
      return wallet;
    }
  },

  /**
   * Get current wallet state
   */
  getWallet(sessionId: string): WalletState {
    return this.getOrCreateWallet(sessionId);
  },

  /**
   * Reset wallet (for testing)
   */
  resetWallet(sessionId: string): void {
    localStorage.removeItem(`${WALLET_STORAGE_KEY}${sessionId}`);
  },
};

/**
 * Hook to use wallet in React components
 */
export const useWallet = (sessionId: string) => {
  const [wallet, setWallet] = React.useState<WalletState>(() =>
    walletService.getOrCreateWallet(sessionId)
  );

  const mintConfession = async (confessionId: string) => {
    const updated = await walletService.mintConfession(sessionId, confessionId);
    setWallet(updated);
    return updated;
  };

  const mintReply = async (replyId: string) => {
    const updated = await walletService.mintReply(sessionId, replyId);
    setWallet(updated);
    return updated;
  };

  return {
    wallet,
    mintConfession,
    mintReply,
  };
};

// Import React for the hook
import React from 'react';
