import { ethers } from "hardhat";

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying token with account:", deployer.address);

    const Token = await ethers.getContractFactory("TestToken");
    const token = await Token.deploy("Test Token", "TST");
    await token.waitForDeployment();

    console.log("Token deployed at:", await token.getAddress());

    const mintAmount = ethers.parseEther("1000");
    const tx = await token.mint(deployer.address, mintAmount);
    await tx.wait();

    console.log(`Minted ${mintAmount} TST to ${deployer.address}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
