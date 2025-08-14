import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";

describe("TimeLockVault", function () {
  let vault: Contract;
  let token: Contract;
  let owner: any;
  let user: any;

  beforeEach(async () => {
    [owner, user] = await ethers.getSigners();
    const TokenFactory = await ethers.getContractFactory("TestToken");
    token = await TokenFactory.deploy("Test", "TST");
    await token.mint(user.address, ethers.parseEther("1000"));

    const VaultFactory = await ethers.getContractFactory("TimeLockVault");
    vault = await VaultFactory.deploy();
  });

  it("allows a user to deposit and withdraw after time lock", async function () {
    const amount = ethers.parseEther("100");
    const duration = 60; // 1 minute lock

    await token.connect(user).approve(vault.address, amount);
    await expect(vault.connect(user).deposit(token.address, amount, duration))
      .to.emit(vault, "Deposited");

    // Fast forward time by 60 seconds
    await ethers.provider.send("evm_increaseTime", [duration]);
    await ethers.provider.send("evm_mine", []);

    await expect(vault.connect(user).withdraw(0)).to.emit(vault, "Withdrawn");
    const balance = await token.balanceOf(user.address);
    expect(balance).to.equal(ethers.parseEther("1000"));
  });

  it("reverts withdrawal before unlock time", async function () {
    const amount = ethers.parseEther("10");
    const duration = 3600; // 1 hour lock
    await token.connect(user).approve(vault.address, amount);
    await vault.connect(user).deposit(token.address, amount, duration);
    await expect(vault.connect(user).withdraw(0)).to.be.revertedWith(
      "TimeLockVault: deposit is still locked"
    );
  });
});