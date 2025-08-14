// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title TimeLockVault
 * @notice A vault that locks ERC‑20 tokens for a specified duration. Users can
 * deposit tokens into the vault with a defined unlock timestamp. After the
 * deadline passes, the user (or the owner on behalf of the user) may
 * withdraw their tokens. Each deposit is independent, allowing multiple
 * concurrent locks for a single user.
 */
using SafeERC20 for IERC20;

contract TimeLockVault is Ownable, ReentrancyGuard {
    // ✅ Construtor exigido pelo Ownable (OZ v5)
    constructor() Ownable(msg.sender) {}

    struct Deposit {
        address token;      // Address of the ERC‑20 token
        uint256 amount;     // Amount of tokens deposited
        uint256 unlockTime; // Timestamp when withdrawal becomes possible
        bool withdrawn;     // Whether the deposit has been withdrawn
    }

    // Mapping from user address to an array of deposits
    mapping(address => Deposit[]) private _deposits;

    // Track unique depositors to assist with accounting (e.g., rescueTokens)
    address[] private depositors;
    mapping(address => bool) private isDepositor;

    // Events
    event Deposited(address indexed user, uint256 indexed depositId, address indexed token, uint256 amount, uint256 unlockTime);
    event Withdrawn(address indexed user, uint256 indexed depositId, address indexed token, uint256 amount);

    /**
     * @notice Deposits tokens into the vault.
     * @param token Address of the ERC‑20 token to deposit.
     * @param amount Amount of tokens to deposit.
     * @param duration Duration in seconds for which tokens should be locked. The
     *  unlock time will be block.timestamp + duration.
     */
    function deposit(address token, uint256 amount, uint256 duration) external nonReentrant {
        require(amount > 0, "TimeLockVault: amount must be greater than zero");
        require(duration > 0, "TimeLockVault: duration must be greater than zero");

        // Transfer tokens from the sender to this contract
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);

        // Record the deposit
        uint256 unlockTime = block.timestamp + duration;
        _deposits[msg.sender].push(Deposit({
            token: token,
            amount: amount,
            unlockTime: unlockTime,
            withdrawn: false
        }));
        uint256 depositId = _deposits[msg.sender].length - 1;

        // Track new depositors. We only add the user to `depositors` once.
        if (!isDepositor[msg.sender]) {
            isDepositor[msg.sender] = true;
            depositors.push(msg.sender);
        }

        emit Deposited(msg.sender, depositId, token, amount, unlockTime);
    }

    /**
     * @notice Returns the number of deposits for a user.
     * @param user Address of the user.
     */
    function depositCount(address user) external view returns (uint256) {
        return _deposits[user].length;
    }

    /**
     * @notice Returns information about a specific deposit.
     * @param user Address of the user.
     * @param depositId Index of the deposit for the user.
     */
    function getDeposit(address user, uint256 depositId) external view returns (address token, uint256 amount, uint256 unlockTime, bool withdrawn) {
        require(depositId < _deposits[user].length, "TimeLockVault: depositId out of range");
        Deposit storage d = _deposits[user][depositId];
        return (d.token, d.amount, d.unlockTime, d.withdrawn);
    }

    /**
     * @notice Withdraws tokens from a specific deposit if the unlock time has passed.
     * @param depositId Index of the deposit for the caller.
     */
    function withdraw(uint256 depositId) external nonReentrant {
        require(depositId < _deposits[msg.sender].length, "TimeLockVault: depositId out of range");
        Deposit storage d = _deposits[msg.sender][depositId];
        require(!d.withdrawn, "TimeLockVault: deposit already withdrawn");
        require(block.timestamp >= d.unlockTime, "TimeLockVault: deposit is still locked");

        // Mark as withdrawn and transfer tokens
        d.withdrawn = true;
        IERC20(d.token).safeTransfer(msg.sender, d.amount);

        emit Withdrawn(msg.sender, depositId, d.token, d.amount);
    }

    /**
     * @notice Owner can rescue tokens accidentally sent to this contract that
     *  aren't part of a user's deposit. It will not allow rescuing tokens
     *  tied to active deposits. Only excess tokens can be rescued.
     * @param token Address of the token to rescue.
     * @param to Destination address to send the rescued tokens.
     */
    function rescueTokens(address token, address to) external onlyOwner nonReentrant {
        require(to != address(0), "TimeLockVault: invalid recipient");
        uint256 balance = IERC20(token).balanceOf(address(this));
        uint256 lockedAmount = 0;

        // Sum all amounts locked for this token across all users
        // Warning: iterating over all deposits may be expensive if there are many users.
        // This function should be used carefully.
        for (uint256 i = 0; i < depositors.length; i++) {
            address user = depositors[i];
            Deposit[] storage arr = _deposits[user];
            for (uint256 j = 0; j < arr.length; j++) {
                Deposit storage d = arr[j];
                if (d.token == token && !d.withdrawn) {
                    lockedAmount += d.amount;
                }
            }
        }
        require(balance > lockedAmount, "TimeLockVault: no excess tokens to rescue");
        uint256 excess = balance - lockedAmount;
        IERC20(token).safeTransfer(to, excess);
    }
}
