//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import {IERC20} from "@openzeppelin/contracts/interfaces/IERC20.sol";

contract Distributor {
    //Errors
    error MismatchedInputLengths();
    error InsufficientTransferAmount();
    error RefundFailed();
    error ETHTransferFailed();
    error NoRecipients();
    error AmountMustBeGreaterThanZero();
    error TokenTransferFailed();

    function distributeEtherAllocation(
        address[] calldata recipients,
        uint256[] calldata values
    ) external payable {
        uint256 length = recipients.length;
        if (length != values.length) revert MismatchedInputLengths();

        uint256 total = 0;
        for (uint256 i = 0; i < length; ) {
            total += values[i];
            (bool success, ) = recipients[i].call{value: values[i]}("");
            if (!success) revert ETHTransferFailed();

            unchecked {
                ++i;
            } // saves gas
        }

        // Refund leftover ETH to sender
        uint256 balance = address(this).balance;
        if (balance > 0) {
            (bool refundSuccess, ) = msg.sender.call{value: balance}("");
            if (!refundSuccess) revert RefundFailed();
        }
    }

    function distributeEther(
        address[] calldata recipients,
        uint256 amountEach
    ) external payable {
        uint256 length = recipients.length;
        if (length == 0) revert NoRecipients();
        if (amountEach == 0) revert AmountMustBeGreaterThanZero();
        if (amountEach * length > msg.value)
            revert InsufficientTransferAmount();

        for (uint256 i = 0; i < length; ) {
            (bool success, ) = recipients[i].call{value: amountEach}("");
            if (!success) revert ETHTransferFailed();

            unchecked {
                ++i;
            }
        }
    }

    function distributeTokenAllocation(
        IERC20 token,
        address[] calldata recipients,
        uint256[] calldata values
    ) external {
        if (recipients.length != values.length) revert MismatchedInputLengths();
        uint256 length = recipients.length;

        uint256 total = 0;
        for (uint256 i = 0; i < length; ) {
            total += values[i];
            unchecked {
                ++i;
            }
        }

        // Pull all tokens into contract once
        require(
            token.transferFrom(msg.sender, address(this), total),
            TokenTransferFailed()
        );

        // Then send tokens out
        for (uint256 i = 0; i < length; ) {
            require(
                token.transfer(recipients[i], values[i]),
                "Token transfer failed"
            );
            unchecked {
                ++i;
            }
        }
    }

    function distributeToken(
        IERC20 token,
        address[] calldata recipients,
        uint256 amountEach
    ) external {
        if (recipients.length == 0) revert NoRecipients();
        if (amountEach <= 0) revert AmountMustBeGreaterThanZero();

        uint256 length = recipients.length;
        uint256 total = recipients.length * amountEach;

        // Pull all tokens into contract once
        require(
            token.transferFrom(msg.sender, address(this), total),
            "TransferFrom failed"
        );

        for (uint256 i = 0; i < length; ) {
            require(
                token.transfer(recipients[i], amountEach),
                "Token transfer failed"
            );
            unchecked {
                ++i;
            }
        }
    }
}
