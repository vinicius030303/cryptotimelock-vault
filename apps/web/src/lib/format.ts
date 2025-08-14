import { ethers } from 'ethers';

/**
 * Format an amount in wei to a human readable string with decimals.
 * @param value BigInt or string representing wei amount.
 */
export function formatEther(value: bigint | string) {
  return ethers.formatEther(value);
}