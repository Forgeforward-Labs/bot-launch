// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Standard} from "./tokens/Standard.sol";
import {FeeToken} from "./tokens/FeeToken.sol";

contract TokenFactory {
    event StandardTokenCreated(
        address token,
        string name,
        string symbol,
        uint256 totalSupply,
        uint8 decimalPlaces,
        address owner
    );

    event FeeTokenCreated(
        address token,
        string name,
        string symbol,
        uint256 totalSupply,
        uint8 decimalPlaces,
        uint8 transferTax,
        address owner
    );

    function createStandardToken(
        string memory name,
        string memory symbol,
        uint256 totalSupply,
        uint8 decimalPlaces
    ) public returns (address token) {
        token = address(
            new Standard(name, symbol, totalSupply, decimalPlaces, msg.sender)
        );
        emit StandardTokenCreated(
            token,
            name,
            symbol,
            totalSupply,
            decimalPlaces,
            msg.sender
        );
        return token;
    }

    function createFeeToken(
        string memory name,
        string memory symbol,
        uint256 totalSupply,
        uint8 decimalPlaces,
        uint8 transferTax
    ) public returns (address token) {
        token = address(
            new FeeToken(
                name,
                symbol,
                totalSupply,
                decimalPlaces,
                transferTax,
                msg.sender
            )
        );
        emit FeeTokenCreated(
            token,
            name,
            symbol,
            totalSupply,
            decimalPlaces,
            transferTax,
            msg.sender
        );
    }
}
