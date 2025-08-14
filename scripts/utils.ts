import { promises as fs } from "fs";
import { ethers } from "hardhat";

/**
 * Save contract ABI and address to a JSON file for use in front‑end applications.
 * This helper can be imported by deploy scripts to automatically persist
 * deployment artifacts into the `abi/` and `deployments/` directories.
 */
export async function saveDeployment(
  contractName: string,
  address: string,
  abi: any,
  network: string
) {
  const deploymentDir = `./deployments/${network}`;
  await fs.mkdir(deploymentDir, { recursive: true });
  const artifact = {
    address,
    abi,
  };
  await fs.writeFile(
    `${deploymentDir}/${contractName}.json`,
    JSON.stringify(artifact, null, 2)
  );

  const abiDir = `./abi`;
  await fs.mkdir(abiDir, { recursive: true });
  await fs.writeFile(
    `${abiDir}/${contractName}.json`,
    JSON.stringify(abi, null, 2)
  );
  console.log(`Saved ABI and address for ${contractName}`);
}