// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract EasyGanCoin is ERC20 {
    // Initial supply
    constructor(uint256 initialSupply) ERC20("EGanCoin", "EGAN") {
        // Whoever deploys this contract will own the token
        _mint(msg.sender, initialSupply);
    }
}
