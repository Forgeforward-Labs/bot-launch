// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {
    MerkleProof
} from "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import {Whitelistable} from "./Whitelistable.sol";
import {Standard} from "../tokenFactory/tokens/Standard.sol";

import {IUniswapV2Router} from "../interfaces/IUniswapV2Router.sol";
import {ILPVault} from "../interfaces/ILPVault.sol";
import {BDEX_V2_ROUTER} from "../libraries/DexAddresses.sol";

contract Sales is Ownable, Whitelistable {
    uint256 public constant TREASURY_ALLOCATION_PERCENTAGE = 10;
    address public TREASURY_ADDRESS;
    address public LPVault;

    address public token;

    SaleData public saleData;
    TokenData public tokenData;
    mapping(address => Participant) public participants;

    struct TokenData {
        address tokenAddress;
        uint8 tokenDecimals;
        string tokenSymbol;
        string tokenName;
        uint256 tokenTotalSupply;
    }
    struct SaleData {
        uint256 startTime;
        uint256 endTime;
        uint256 softCap;
        uint256 hardCap;
        uint256 maxBuy;
        uint256 saleSold;
        uint256 totalTokensForSale;
        bytes salesJson;
        uint256 totalTokensForLiquidity;
        uint8 liquidityBPS;
    }
    //events
    event TokensPurchased(address indexed buyer, uint256 ethAmount);
    event TokensClaimed(address indexed claimer, uint256 tokenAmount);
    event Refunded(address indexed participant, uint256 ethAmount);
    event SaleFinalized(
        uint256 totalSold,
        uint256 liquidityAmount,
        uint256 treasuryAmount
    );

    //errors
    error SaleNotActive();
    error InsufficientFunds();
    error SaleNotStarted();
    error endTimeed();
    error SaleNotEnded();
    error InvalidAmount();
    error NoClaimableAmount();
    error SaleAlreadyStarted();
    error SaleAlreadyEnded();
    error SaleAlreadySoldOut();
    error MaxBuyExceeded();
    error UseWhitelist();
    error InvalidWhitelist();

    enum ParticipantStatus {
        DEFAULT,
        CLAIMED,
        REFUNDED
    }
    struct Participant {
        address participant;
        uint256 amount;
        ParticipantStatus status;
    }

    //modifiers
    modifier saleActive() {
        if (
            block.timestamp < saleData.startTime ||
            block.timestamp > saleData.endTime
        ) {
            revert SaleNotActive();
        }
        _;
    }

    modifier onlyAfterSale() {
        if (block.timestamp < saleData.endTime) {
            revert SaleNotEnded();
        }
        _;
    }

    //constructor
    constructor(
        address _token,
        SaleData memory _saleData,
        TokenData memory _tokenData,
        address _LPVault,
        address _owner,
        address _treasuryAddress
    ) Ownable(msg.sender) {
        token = _token;
        LPVault = _LPVault;
        saleData = _saleData;
        tokenData = _tokenData;
        transferOwnership(_owner);
        TREASURY_ADDRESS = _treasuryAddress;
    }

    function getSaleData() external view returns (SaleData memory) {
        return saleData;
    }

    function getParticipant(
        address _participant
    ) public view returns (Participant memory participant) {
        participant = participants[_participant];
    }

    //buy
    function _buy(uint256 amount) internal saleActive {
        if (participants[msg.sender].amount + amount > saleData.maxBuy) {
            revert MaxBuyExceeded();
        }
        participants[msg.sender].amount += msg.value;
        saleData.saleSold += msg.value;
        emit TokensPurchased(msg.sender, msg.value);
    }

    function buy(uint256 amount) external payable saleActive {
        require(msg.value == amount, "Invalid amount");
        if (whitelistRootHash != bytes32(0)) {
            revert UseWhitelist();
        }
        _buy(msg.value);
    }

    //claim
    function claim() external onlyAfterSale {
        require(
            saleData.saleSold >= saleData.softCap,
            "Soft cap not reached"
        );
        require(
            participants[msg.sender].status == ParticipantStatus.DEFAULT,
            "Cannot Claim"
        );
        uint256 claimableAmount = getClaimableAmount(msg.sender);
        if (claimableAmount == 0) {
            revert NoClaimableAmount();
        }
        participants[msg.sender].status = ParticipantStatus.CLAIMED;
        IERC20(token).transfer(msg.sender, claimableAmount);
        emit TokensClaimed(msg.sender, claimableAmount);
    }

    function getClaimableAmount(
        address participant
    ) internal view returns (uint256) {
        return
            (saleData.totalTokensForSale * participants[participant].amount) /
            saleData.saleSold;
    }

    //refund
    function refund() external onlyAfterSale {
        require(saleData.saleSold < saleData.softCap, "Soft cap was reached");
        require(
            participants[msg.sender].status == ParticipantStatus.DEFAULT,
            "Cannot claim refund"
        );
        uint256 refundAmount = participants[msg.sender].amount;
        if (refundAmount == 0) {
            revert InvalidAmount();
        }
        participants[msg.sender].status = ParticipantStatus.REFUNDED;
        payable(msg.sender).transfer(refundAmount);
        emit Refunded(msg.sender, refundAmount);
    }

    //finalize
    function finalizeSale(
        address casher
    ) external payable onlyAfterSale onlyOwner {
        require(
            saleData.saleSold >= saleData.softCap,
            "Soft cap not reached"
        );
        uint256 sold = saleData.saleSold;
        uint256 liquidity = (saleData.liquidityBPS * sold) / 100;
        uint256 treasury = (TREASURY_ALLOCATION_PERCENTAGE * sold) / 100;
        payable(TREASURY_ADDRESS).transfer(treasury);
        payable(casher).transfer(sold - liquidity - treasury);

        IERC20(token).approve(
            BDEX_V2_ROUTER,
            saleData.totalTokensForLiquidity
        );
        IUniswapV2Router(BDEX_V2_ROUTER).addLiquidityETH{value: liquidity}(
            token,
            saleData.totalTokensForLiquidity,
            saleData.totalTokensForLiquidity,
            liquidity,
            LPVault,
            block.timestamp + 5
        );
        ILPVault(LPVault).registerLP(token);

        emit SaleFinalized(sold, liquidity, treasury);
    }

    //whitelist
    function buyWithWhitelist(
        uint256 amount,
        bytes32[] calldata proof
    ) external payable saleActive {
        // if (msg.value < saleData.salePrice) revert InsufficientFunds();
        if (participants[msg.sender].amount + msg.value > saleData.maxBuy)
            revert MaxBuyExceeded();
        if (!_verifyWhitelist(proof)) revert InvalidWhitelist();
        _buy(amount);
    }
    function _verifyWhitelist(
        bytes32[] calldata proof
    ) internal view returns (bool) {
        return
            MerkleProof.verify(
                proof,
                whitelistRootHash,
                keccak256(abi.encodePacked(msg.sender))
            );
    }
}
