import { ethers, network } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  const addr = await deployer.getAddress();
  const bal = await ethers.provider.getBalance(addr);

  console.log("Deploying contracts with the account:", addr);
  console.log("Account balance:", bal.toString());

  const Vault = await ethers.getContractFactory("TimeLockVault");
  const vault = await Vault.connect(deployer).deploy();
  await vault.waitForDeployment();

  const vaultAddress = await vault.getAddress();
  console.log("TimeLockVault deployed to:", vaultAddress);
  console.log("Network:", network.name);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
