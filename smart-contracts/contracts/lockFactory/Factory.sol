// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import {TokenLock} from "./TokenLock.sol";
import {IERC20} from "@openzeppelin/contracts/interfaces/IERC20.sol";

contract LockFactory {
    //events
    event LockCreated(
        address indexed lock,
        address indexed token,
        address indexed owner,
        uint256 lockingAmount,
        uint256 lockTimeEnd,
        string projectImageUrl
    );

    //errors
    error TransferFailed();
    error InvalidEndTime();

    /**
     * @dev Create a new lock
     * @param _token The token to lock
     * @param _owner The owner of the lock
     * @param _lockingAmount The amount to lock
     * @param _lockTimeEnd The time the lock ends
     * @param _projectImageUrl The image url of the project
     */

    function createLock(
        address _token,
        address _owner,
        uint256 _lockingAmount,
        uint256 _lockTimeEnd,
        string memory _projectImageUrl
    ) external payable returns (address) {
        if (_lockTimeEnd < block.timestamp) {
            revert InvalidEndTime();
        }

        TokenLock lock = new TokenLock(
            _token,
            _owner,
            _lockingAmount,
            _lockTimeEnd,
            _projectImageUrl
        );

        //transfer the funds to the lock
        if (_token == address(0)) {
            (bool success, ) = payable(address(lock)).call{
                value: _lockingAmount
            }("");
            require(success, TransferFailed());
        } else {
            IERC20(_token).transferFrom(_owner, address(lock), _lockingAmount);
        }

        emit LockCreated(
            address(lock),
            _token,
            _owner,
            _lockingAmount,
            _lockTimeEnd,
            _projectImageUrl
        );
        return address(lock);
    }
}
