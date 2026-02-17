import { PIZZA_PASS_ABI } from './abis/pizzaPass';
import { REFLEX_GAME_ABI } from './abis/reflexGame';
import { PIZZA_ORDER_PROCESSOR_ABI } from './abis/pizzaOrderProcessor';
import { PREDICTION_MARKET_ABI } from './abis/predictionMarket';

// TODO: Replace these placeholder addresses with real deployed contract addresses
export const PIZZA_PASS_ADDRESS = '0x0000000000000000000000000000000000000001' as const;
export const REFLEX_GAME_ADDRESS = '0x0000000000000000000000000000000000000002' as const;
export const PREDICTION_MARKET_ADDRESS = '0x0000000000000000000000000000000000000003' as const;
export const PIZZA_ORDER_PROCESSOR_ADDRESS = '0x0000000000000000000000000000000000000004' as const;

export {
  PIZZA_PASS_ABI,
  REFLEX_GAME_ABI,
  PIZZA_ORDER_PROCESSOR_ABI,
  PREDICTION_MARKET_ABI,
};

