export const PIZZA_ORDER_PROCESSOR_ABI = [
  {
    type: 'function',
    name: 'getTotalOrders',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'getBlockStats',
    stateMutability: 'view',
    inputs: [{ name: 'blockNumber', type: 'uint256' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'batchProcessOrders',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'customers', type: 'address[]' },
      { name: 'pizzaTypes', type: 'uint8[]' },
    ],
    outputs: [],
  },
] as const;

