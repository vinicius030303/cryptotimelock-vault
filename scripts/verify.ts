import { run } from "hardhat";

/**
 * Verify a deployed contract on Etherscan. Provide the deployed contract address
 * and constructor arguments (none for TimeLockVault) via command line:
 * `npx hardhat run scripts/verify.ts --network sepolia --args <address>`
 */
async function main() {
  const address = process.env.CONTRACT_ADDRESS;
  if (!address) {
    throw new Error("Please set CONTRACT_ADDRESS env variable to the deployed address.");
  }
  console.log(`Verifying contract at ${address}...`);
  await run("verify:verify", {
    address: address,
    constructorArguments: [],
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});