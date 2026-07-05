// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {TransferHelper} from "../libraries/TransferHelper.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract LPVault is Ownable {
    mapping(address token => address LPToken) public LPs;

    constructor(address _owner) Ownable(_owner) {}

    receive() external payable {}

    function withdrawLP(address token) external onlyOwner {
        address LP = LPs[token];
        uint256 balance = IERC20(LP).balanceOf(address(this));
        TransferHelper.safeTransfer(LP, msg.sender, balance);
    }

    function withdraw() external onlyOwner {
        TransferHelper.safeTransferETH(msg.sender, (address(this)).balance);
    }
}
