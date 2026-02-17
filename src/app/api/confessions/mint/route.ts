import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';

// For demo purposes, these would come from environment variables
const PIZZATOK_CONTRACT_ADDRESS = process.env.PIZZATOK_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000001';
const PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY || '';
const RPC_URL = process.env.MONAD_RPC_URL || 'https://testnet-rpc.monad.xyz';

const PIZZATOK_ABI = [
  {
    inputs: [
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'string', name: 'confessionId', type: 'string' },
    ],
    name: 'mintConfessionReward',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'string', name: 'replyId', type: 'string' },
    ],
    name: 'mintReplyReward',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'user', type: 'address' }],
    name: 'getUserBalance',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
];

/**
 * POST /api/confessions/mint
 * Mints tokens for a new confession
 */
export async function POST(request: NextRequest) {
  try {
    const { userAddress, confessionId, type = 'confession' } = await request.json();

    if (!userAddress || !confessionId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate Ethereum address
    if (!ethers.isAddress(userAddress)) {
      return NextResponse.json(
        { error: 'Invalid Ethereum address' },
        { status: 400 }
      );
    }

    // For demo mode (no actual contract): just return a mock response
    if (!PRIVATE_KEY || PRIVATE_KEY === '') {
      console.warn('DEPLOYER_PRIVATE_KEY not set - running in demo mode');
      
      // Simulate token minting
      const reward = type === 'confession' ? 50 : 25;
      const mockBalance = 3 + reward; // Starting balance + reward
      
      return NextResponse.json(
        {
          success: true,
          message: `Demo mode: ${reward} 🍕TOK minted for ${type}`,
          reward,
          newBalance: mockBalance,
          transactionHash: `0x${Math.random().toString(16).slice(2)}`,
          mode: 'demo',
        },
        { status: 200 }
      );
    }

    // Initialize provider and signer
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const signer = new ethers.Wallet(PRIVATE_KEY, provider);

    // Create contract instance
    const contract = new ethers.Contract(
      PIZZATOK_CONTRACT_ADDRESS,
      PIZZATOK_ABI,
      signer
    );

    // Call appropriate minting function
    let tx;
    if (type === 'confession') {
      tx = await contract.mintConfessionReward(userAddress, confessionId);
    } else if (type === 'reply') {
      tx = await contract.mintReplyReward(userAddress, confessionId);
    } else {
      return NextResponse.json(
        { error: 'Invalid type. Must be "confession" or "reply"' },
        { status: 400 }
      );
    }

    // Wait for transaction
    const receipt = await tx.wait();

    // Get updated balance
    const balanceWei = await contract.getUserBalance(userAddress);
    const balance = ethers.formatUnits(balanceWei, 18);

    return NextResponse.json(
      {
        success: true,
        message: `${type === 'confession' ? 50 : 25} 🍕TOK minted successfully`,
        reward: type === 'confession' ? 50 : 25,
        newBalance: parseFloat(balance),
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Minting error:', error);

    // Return meaningful error message
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      {
        error: 'Failed to mint tokens',
        message,
        fallback: true, // Indicates client should use local balance update
      },
      { status: 500 }
    );
  }
}
