// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {TransferHelper} from "../libraries/TransferHelper.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IUniswapV2Factory} from "../interfaces/IUniswapV2Factory.sol";
import {BDEX_V2_FACTORY, BDEX_V2_WBOT} from "../libraries/DexAddresses.sol";

contract LPVault is Ownable {
    mapping(address token => address LPToken) public LPs;

    error PairNotFound();
    error LPNotRegistered();

    constructor(address _owner) Ownable(_owner) {}

    receive() external payable {}

    // Looks up the token/WBOT pair on the DEX factory and records it so it
    // can later be withdrawn. Safe to call by anyone: the pair address is
    // derived deterministically from the factory, not caller-supplied.
    function registerLP(address token) public {
        address pair = IUniswapV2Factory(BDEX_V2_FACTORY).getPair(
            token,
            BDEX_V2_WBOT
        );
        if (pair == address(0)) revert PairNotFound();
        LPs[token] = pair;
    }

    function withdrawLP(address token) external onlyOwner {
        address LP = LPs[token];
        if (LP == address(0)) revert LPNotRegistered();
        uint256 balance = IERC20(LP).balanceOf(address(this));
        TransferHelper.safeTransfer(LP, msg.sender, balance);
    }

    function withdraw() external onlyOwner {
        TransferHelper.safeTransferETH(msg.sender, (address(this)).balance);
    }
}
