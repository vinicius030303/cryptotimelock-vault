import { ethers } from "hardhat";

/**
 * Increase the EVM time by a certain number of seconds.
 * Useful for simulating passage of time in tests.
 * @param seconds Number of seconds to increase time.
 */
export async function increaseTime(seconds: number) {
  await ethers.provider.send("evm_increaseTime", [seconds]);
  await ethers.provider.send("evm_mine", []);
}