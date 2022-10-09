// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract GanCoin is ERC20 {
    // Initial supply 
    constructor(uint initialSupply) ERC20("GanCoin", "GAN") {
        // Whoever deploys this contract will own the token
        _mint(msg.sender, initialSupply);
    }
}
