// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

interface ILPAdapter {
    /**
    @dev addLiquidity */
    function addLiquidity(address token0, address token1) external;
}
