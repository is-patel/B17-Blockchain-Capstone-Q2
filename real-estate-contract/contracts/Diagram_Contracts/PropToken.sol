// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title PropTokenWithRolesAndBidding
 * @notice This contract is a custodial ERC20 token that supports:
 *         - Role-based authorization (bank, escrow, property management)
 *         - Wallet registration for users
 *         - Simulated bank loans
 *         - Escrow functionality for holding tokens
 *         - Robust bidding on properties with multiple bids allowed per property.
 */
contract PropToken is ERC20, AccessControl {
    // -------------------------
    //    Role Definitions
    // -------------------------
    bytes32 public constant BANK_ROLE = keccak256("BANK_ROLE");
    bytes32 public constant ESCROW_ROLE = keccak256("ESCROW_ROLE");
    bytes32 public constant PROPERTY_MANAGER_ROLE = keccak256("PROPERTY_MANAGER_ROLE");

    // -------------------------
    //    Custodial Balances
    // -------------------------
    // Tracks each user's off-chain (custodial) token balance.
    mapping(bytes32 => uint256) private _userBalances;

    // -------------------------
    //    Wallet Registration
    // -------------------------
    // Maps user identifiers to their registered wallet addresses.
    mapping(bytes32 => address) public userWallets;

    // -------------------------
    //         Escrow
    // -------------------------
    // Allows holding tokens from a user's custodial balance.
    mapping(bytes32 => uint256) private _escrowBalances;

    // -------------------------
    //      Bidding Data
    // -------------------------
    struct Bid {
        bytes32 userId;       // Identifier for the bidder
        uint256 amount;       // Bid amount (tokens locked)
        uint256 timestamp;    // When the bid was placed/updated
        bool active;          // Whether the bid is active
    }

    // Each property (identified by an integer) has an array of bids.
    mapping(uint256 => Bid[]) public propertyBids;
    // Helps track if a user has an active bid on a property.
    // We store index+1 so that 0 means no active bid.
    mapping(uint256 => mapping(bytes32 => uint256)) public userBidIndex;

    // -------------------------
    //         Events
    // -------------------------
    event WalletRegistered(bytes32 indexed userId, address wallet);
    event LoanSimulated(bytes32 indexed userId, uint256 amount);
    event EscrowHeld(bytes32 indexed userId, uint256 amount);
    event EscrowReleased(bytes32 indexed userId, uint256 amount);
    event BidPlaced(bytes32 indexed userId, uint256 indexed propertyId, uint256 amount, uint256 timestamp);
    event BidUpdated(bytes32 indexed userId, uint256 indexed propertyId, uint256 newAmount, uint256 timestamp);
    event BidCanceled(bytes32 indexed userId, uint256 indexed propertyId, uint256 amount, uint256 timestamp);
    event BidFinalized(uint256 indexed propertyId, bytes32 winningUserId, uint256 winningAmount, address propertySeller);

    // -------------------------
    //         Constructor
    // -------------------------
    constructor() ERC20("PropToken", "PTKN") {
        // Grant deployer all roles.
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(BANK_ROLE, msg.sender);
        _grantRole(ESCROW_ROLE, msg.sender);
        _grantRole(PROPERTY_MANAGER_ROLE, msg.sender);

        // Optionally mint an initial supply to the contract (custodial tokens).
        // _mint(address(this), 1_000_000 * 10**decimals());
    }

    // -------------------------
    //    Core ERC20 Functions
    // -------------------------
    /**
     * @notice Mint tokens into the contract (to be allocated to users).
     * @dev Only accounts with DEFAULT_ADMIN_ROLE can call.
     */
    function mintToContract(uint256 amount) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _mint(address(this), amount);
    }

    /**
     * @notice Returns a user's available custodial balance.
     */
    function userBalanceOf(bytes32 userId) external view returns (uint256) {
        return _userBalances[userId];
    }

    // -------------------------
    //    Wallet Registration
    // -------------------------
    /**
     * @notice Allows a user to register their wallet address.
     * @dev The caller must match the wallet address being registered.
     */
    function registerUserWallet(bytes32 userId, address wallet) external {
        require(msg.sender == wallet, "You can only register your own wallet");
        require(wallet != address(0), "Invalid wallet address");
        userWallets[userId] = wallet;
        emit WalletRegistered(userId, wallet);
    }

    // -------------------------
    //    Balance Management
    // -------------------------
    /**
     * @notice Credits a user's custodial balance (e.g. for rewards).
     * @dev Only DEFAULT_ADMIN_ROLE can call.
     */
    function creditUser(bytes32 userId, uint256 amount) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(balanceOf(address(this)) >= amount, "Not enough tokens in contract");
        _userBalances[userId] += amount;
    }

    /**
     * @notice Debits a user's custodial balance.
     * @dev Only DEFAULT_ADMIN_ROLE can call.
     */
    function debitUser(bytes32 userId, uint256 amount) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_userBalances[userId] >= amount, "Insufficient user balance");
        _userBalances[userId] -= amount;
    }

    // -------------------------
    //    Bank Loan Simulation
    // -------------------------
    /**
     * @notice Credits tokens to a user's custodial balance simulating a loan.
     * @dev Only accounts with BANK_ROLE can call.
     */
    function simulateLoan(bytes32 userId, uint256 amount) external onlyRole(BANK_ROLE) {
        require(balanceOf(address(this)) >= amount, "Not enough tokens in contract");
        _userBalances[userId] += amount;
        emit LoanSimulated(userId, amount);
    }

    // -------------------------
    //    Withdrawals
    // -------------------------
    /**
     * @notice Withdraws tokens from a user's custodial balance to their registered wallet.
     * @dev Only accounts with PROPERTY_MANAGER_ROLE can call.
     */
    function withdrawToRegisteredWallet(bytes32 userId, uint256 amount) external onlyRole(PROPERTY_MANAGER_ROLE) {
        require(_userBalances[userId] >= amount, "Insufficient user balance");
        address wallet = userWallets[userId];
        require(wallet != address(0), "No wallet registered for user");
        _userBalances[userId] -= amount;
        _transfer(address(this), wallet, amount);
    }

    // -------------------------
    //         Escrow
    // -------------------------
    /**
     * @notice Holds tokens from a user's custodial balance in escrow.
     * @dev Only accounts with ESCROW_ROLE can call.
     */
    function holdInEscrow(bytes32 userId, uint256 amount) external onlyRole(ESCROW_ROLE) {
        require(_userBalances[userId] >= amount, "Insufficient user balance");
        _userBalances[userId] -= amount;
        _escrowBalances[userId] += amount;
        emit EscrowHeld(userId, amount);
    }

    /**
     * @notice Releases tokens from escrow back to a user's available custodial balance.
     * @dev Only accounts with ESCROW_ROLE can call.
     */
    function releaseFromEscrow(bytes32 userId, uint256 amount) external onlyRole(ESCROW_ROLE) {
        require(_escrowBalances[userId] >= amount, "Insufficient escrow balance");
        _escrowBalances[userId] -= amount;
        _userBalances[userId] += amount;
        emit EscrowReleased(userId, amount);
    }

    /**
     * @notice Returns the escrowed token balance for a user.
     */
    function escrowBalanceOf(bytes32 userId) external view returns (uint256) {
        return _escrowBalances[userId];
    }

    // -------------------------
    //        Bidding
    // -------------------------
    /**
     * @notice Place or update a bid for a property.
     *         If the user already has an active bid, the new bid must be higher.
     *         Tokens for the bid are deducted from the user's custodial balance.
     *
     * @dev Only accounts with PROPERTY_MANAGER_ROLE can call.
     * @param userId The identifier of the user placing the bid.
     * @param propertyId The identifier for the property.
     * @param amount The bid amount.
     */
    function placeBid(bytes32 userId, uint256 propertyId, uint256 amount) external onlyRole(PROPERTY_MANAGER_ROLE) {
        require(_userBalances[userId] >= amount, "Insufficient user balance for bid");

        uint256 indexPlusOne = userBidIndex[propertyId][userId];
        if (indexPlusOne != 0) {
            // Update existing bid
            uint256 index = indexPlusOne - 1;
            Bid storage existingBid = propertyBids[propertyId][index];
            require(existingBid.active, "Existing bid is not active");
            require(amount > existingBid.amount, "New bid must be higher than existing bid");
            uint256 additionalAmount = amount - existingBid.amount;
            require(_userBalances[userId] >= additionalAmount, "Insufficient balance for bid increase");
            _userBalances[userId] -= additionalAmount;
            existingBid.amount = amount;
            existingBid.timestamp = block.timestamp;
            emit BidUpdated(userId, propertyId, amount, block.timestamp);
        } else {
            // Place new bid
            _userBalances[userId] -= amount;
            Bid memory newBid = Bid({
                userId: userId,
                amount: amount,
                timestamp: block.timestamp,
                active: true
            });
            propertyBids[propertyId].push(newBid);
            userBidIndex[propertyId][userId] = propertyBids[propertyId].length; // Store index+1
            emit BidPlaced(userId, propertyId, amount, block.timestamp);
        }
    }

    /**
     * @notice Cancel an active bid for a property.
     *         The bid amount is refunded to the user's custodial balance.
     *
     * @dev Only accounts with PROPERTY_MANAGER_ROLE can call.
     * @param userId The identifier of the user canceling their bid.
     * @param propertyId The property identifier.
     */
    function cancelBid(bytes32 userId, uint256 propertyId) external onlyRole(PROPERTY_MANAGER_ROLE) {
        uint256 indexPlusOne = userBidIndex[propertyId][userId];
        require(indexPlusOne != 0, "No active bid found for user on this property");
        uint256 index = indexPlusOne - 1;
        Bid storage bidInstance = propertyBids[propertyId][index];
        require(bidInstance.active, "Bid is not active");
        bidInstance.active = false;
        _userBalances[userId] += bidInstance.amount;
        userBidIndex[propertyId][userId] = 0;
        emit BidCanceled(userId, propertyId, bidInstance.amount, block.timestamp);
    }

    /**
     * @notice Finalizes the bidding process for a property by automatically selecting the highest active bid.
     *         The winning bid's tokens are transferred to the property seller, and all other bids are refunded.
     *
     * @dev Only accounts with PROPERTY_MANAGER_ROLE can call.
     * @param propertyId The property identifier.
     * @param propertySeller The wallet address of the property seller.
     */
    function finalizeBids(uint256 propertyId, address propertySeller) external onlyRole(PROPERTY_MANAGER_ROLE) {
        require(propertySeller != address(0), "Invalid seller address");
        Bid[] storage bids = propertyBids[propertyId];
        uint256 winningIndex = 0;
        uint256 highestBid = 0;
        bool found = false;

        // Determine the highest active bid
        for (uint256 i = 0; i < bids.length; i++) {
            if (bids[i].active && bids[i].amount > highestBid) {
                highestBid = bids[i].amount;
                winningIndex = i;
                found = true;
            }
        }
        require(found, "No active bids found for this property");

        // Process the winning bid
        Bid storage winningBid = bids[winningIndex];
        winningBid.active = false;
        userBidIndex[propertyId][winningBid.userId] = 0;
        _transfer(address(this), propertySeller, winningBid.amount);

        // Refund all other active bids
        for (uint256 i = 0; i < bids.length; i++) {
            if (i != winningIndex && bids[i].active) {
                bids[i].active = false;
                _userBalances[bids[i].userId] += bids[i].amount;
                userBidIndex[propertyId][bids[i].userId] = 0;
                emit BidCanceled(bids[i].userId, propertyId, bids[i].amount, block.timestamp);
            }
        }

        emit BidFinalized(propertyId, winningBid.userId, winningBid.amount, propertySeller);
    }
}
