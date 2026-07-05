//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import {IERC20} from "@openzeppelin/contracts/interfaces/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract TokenLock is Ownable {
    address public token;
    bool public isNative;
    uint256 public lockTimeEnd;
    string public projectImageUrl;
    uint256 public lockingAmount;

    //events
    event Received(address indexed sender, uint256 amount);
    event IncreaseTime(uint256 newExpiration);
    event Withdraw(address indexed user, uint256 amount);

    //errors
    error LockNotEnded(uint256 end, uint256 now);
    error CanOnlyIncreaseExpiration(
        uint256 newExpiration,
        uint256 oldExpiration
    );
    receive() external payable {
        emit Received(msg.sender, msg.value);
    }

    constructor(
        address _token,
        address _owner,
        uint256 _lockingAmount,
        uint256 _lockTimeEnd,
        string memory _projectImageUrl
    ) Ownable(_owner) {
        token = _token;
        isNative = _token == address(0);
        lockTimeEnd = _lockTimeEnd;
        projectImageUrl = _projectImageUrl;
        lockingAmount = _lockingAmount;
    }

    /**
     * @dev Increase the time until expiration. Only the owner can perform this.
     * @param _newExpiration New date time in seconds when timelock expires.
     */
    function increaseTime(uint _newExpiration) public onlyOwner {
        require(
            _newExpiration > lockTimeEnd,
            CanOnlyIncreaseExpiration(lockTimeEnd, _newExpiration)
        );
        lockTimeEnd = _newExpiration;
        emit IncreaseTime(_newExpiration);
    }

    /**
     * @dev Withdraw the funds from the contract. Only the owner can perform this.
     */
    function withdraw() external onlyOwner {
        require(
            block.timestamp > lockTimeEnd,
            LockNotEnded(lockTimeEnd, block.timestamp)
        );
        if (isNative) {
            withdrawNative();
        } else {
            withdrawToken();
        }
    }

    /**
     * @dev Update the project image url. Only the owner can perform this.
     * @param _projectImageUrl The new project image url.
     */
    function updateProjectImageUrl(
        string memory _projectImageUrl
    ) external onlyOwner {
        projectImageUrl = _projectImageUrl;
    }

    function withdrawToken() internal onlyOwner {
        IERC20 _token = IERC20(token);
        uint256 balance = _token.balanceOf(address(this));
        _token.transfer(msg.sender, balance);
        emit Withdraw(msg.sender, balance);
    }

    function withdrawNative() internal onlyOwner {
        uint256 balance = address(this).balance;
        (bool success, ) = payable(msg.sender).call{value: balance}("");
        require(success, "Transfer failed");
        emit Withdraw(msg.sender, balance);
    }
}
