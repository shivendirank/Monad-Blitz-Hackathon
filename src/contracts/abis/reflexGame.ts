export const REFLEX_GAME_ABI = [
  {
    type: 'function',
    name: 'submitReaction',
    stateMutability: 'nonpayable',
    inputs: [],
    outputs: [],
  },
  {
    type: 'function',
    name: 'startRound',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'windowMs', type: 'uint256' }],
    outputs: [],
  },
  {
    type: 'function',
    name: 'endRound',
    stateMutability: 'nonpayable',
    inputs: [],
    outputs: [],
  },
  {
    type: 'event',
    name: 'RoundStarted',
    inputs: [
      { name: 'roundId', type: 'uint256', indexed: true },
      { name: 'startTime', type: 'uint256', indexed: false },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'ReactionSubmitted',
    inputs: [
      { name: 'roundId', type: 'uint256', indexed: true },
      { name: 'player', type: 'address', indexed: true },
      { name: 'reactionTime', type: 'uint256', indexed: false },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'RoundEnded',
    inputs: [
      { name: 'roundId', type: 'uint256', indexed: true },
      { name: 'winner', type: 'address', indexed: false },
      { name: 'winTime', type: 'uint256', indexed: false },
    ],
    anonymous: false,
  },
] as const;

