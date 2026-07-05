// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Sales} from "./Sales.sol";
import {TransferHelper} from "../libraries/TransferHelper.sol";

contract SalesFactory is Ownable {
    address public treasuryAddress;
    address public lpVault;

    address[] public allSales;
    mapping(address => address[]) public salesByOwner;

    receive() external payable {}

    //events
    event SaleCreated(
        address indexed saleAddress,
        address saleOwner,
        address token,
        Sales.SaleData saleData
    );
    event TreasuryAddressUpdated(address oldAddress, address newAddress);
    event LPVaultUpdated(address oldAddress, address newAddress);

    //errors
    error ZeroAddress();

    constructor(
        address _treasuryAddress,
        address _lpVault
    ) Ownable(msg.sender) {
        if (_treasuryAddress == address(0) || _lpVault == address(0))
            revert ZeroAddress();
        treasuryAddress = _treasuryAddress;
        lpVault = _lpVault;
    }

    function createSale(
        address token,
        Sales.SaleData memory _saleData,
        Sales.TokenData memory _tokenData
    ) external returns (address saleAddress) {
        Sales sale = new Sales(
            token,
            _saleData,
            _tokenData,
            lpVault,
            msg.sender,
            treasuryAddress
        );
        saleAddress = address(sale);
        allSales.push(saleAddress);
        salesByOwner[msg.sender].push(saleAddress);
        TransferHelper.safeTransferFrom(
            token,
            msg.sender,
            address(sale),
            _saleData.totalTokensForLiquidity + _saleData.totalTokensForSale
        );
        emit SaleCreated(saleAddress, msg.sender, sale.token(), _saleData);
    }

    function setTreasuryAddress(address _treasuryAddress) external onlyOwner {
        if (_treasuryAddress == address(0)) revert ZeroAddress();
        emit TreasuryAddressUpdated(treasuryAddress, _treasuryAddress);
        treasuryAddress = _treasuryAddress;
    }

    function setLPVault(address _lpVault) external onlyOwner {
        if (_lpVault == address(0)) revert ZeroAddress();
        emit LPVaultUpdated(lpVault, _lpVault);
        lpVault = _lpVault;
    }

    function getAllSales() external view returns (address[] memory) {
        return allSales;
    }

    function getSalesByOwner(
        address owner
    ) external view returns (address[] memory) {
        return salesByOwner[owner];
    }

    function totalSales() external view returns (uint256) {
        return allSales.length;
    }
}
