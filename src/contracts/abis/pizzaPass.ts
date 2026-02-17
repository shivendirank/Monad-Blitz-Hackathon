export const PIZZA_PASS_ABI = [
  {
    type: 'function',
    name: 'mintPass',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'imageURI', type: 'string' }],
    outputs: [{ name: 'tokenId', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'hasPass',
    stateMutability: 'view',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [{ name: '', type: 'bool' }],
  },
] as const;

