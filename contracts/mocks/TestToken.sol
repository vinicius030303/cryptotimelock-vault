// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @title TestToken
/// @notice A simple ERC‑20 token for testing TimeLockVault. Anyone can mint tokens.
contract TestToken is ERC20 {
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {}

    /// @notice Mint new tokens to a given address. Only for testing, no access control.
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}