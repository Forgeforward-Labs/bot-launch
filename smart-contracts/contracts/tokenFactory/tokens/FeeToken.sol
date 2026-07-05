// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Standard} from "./Standard.sol";

contract FeeToken is Standard {
    uint8 private TRANSFER_TAX;
    mapping(address => bool) private excludedFromTax;

    uint8 constant MAX_TRANSFER_TAX = 100; // 100%
    uint8 constant MIN_TRANSFER_TAX = 0; // 0%
    uint8 constant FEE_DENOMINATOR = 100;

    constructor(
        string memory name,
        string memory symbol,
        uint256 totalSupply,
        uint8 decimalPlaces,
        uint8 transferTax,
        address owner
    ) Standard(name, symbol, totalSupply, decimalPlaces, owner) {
        excludedFromTax[owner] = true;
        TRANSFER_TAX = transferTax;
    }

    function getTransferTax() public view returns (uint8) {
        return TRANSFER_TAX;
    }

    function setTransferTax(uint8 tax) public onlyOwner {
        TRANSFER_TAX = tax;
    }

    function setExcludedFromTax(
        address account,
        bool excluded
    ) public onlyOwner {
        excludedFromTax[account] = excluded;
    }

    function transfer(
        address to,
        uint256 amount
    ) public override returns (bool) {
        if (!excludedFromTax[msg.sender]) {
            uint256 tax = (amount * TRANSFER_TAX) / FEE_DENOMINATOR;
            amount -= tax;
            _transfer(msg.sender, owner(), tax);
            return true;
        }
        _transfer(msg.sender, to, amount);
        return true;
    }
}
