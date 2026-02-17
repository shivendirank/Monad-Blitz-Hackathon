// Monad Blitz Testnet Configuration
export const MONAD_BLITZ_CONFIG = {
  chainId: 10143, // Monad Blitz Testnet
  chainName: 'Monad Blitz Testnet',
  rpcUrl: 'https://testnet-rpc.monad.xyz',
  nativeCurrency: {
    name: 'Monad',
    symbol: 'MON',
    decimals: 18,
  },
  blockExplorerUrl: 'https://testnet-explorer.monad.xyz',
};

// PizzaTok Contract Configuration
export const PIZZATOK_CONTRACT = {
  address: '0x0000000000000000000000000000000000000001', // TODO: Deploy and set actual address
  chainId: MONAD_BLITZ_CONFIG.chainId,
  name: 'PizzaTok',
  symbol: '🍕TOK',
  decimals: 18,
};

// Reward amounts
export const REWARDS = {
  CONFESSION: 50, // 50 tokens for posting a confession
  REPLY: 25, // 25 tokens for replying
  UPVOTE_MILESTONE: 100, // Bonus when confession reaches 100 upvotes
};

// Export environment variables for backend
export const BACKEND_CONFIG = {
  // Private key should be set in .env.local
  // The backend will use this to sign transactions
  deployerAddress: process.env.NEXT_PUBLIC_DEPLOYER_ADDRESS || '0x0000000000000000000000000000000000000000',
};
