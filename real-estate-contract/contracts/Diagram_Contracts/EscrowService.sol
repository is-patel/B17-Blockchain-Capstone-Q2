// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IRealEstateToken {
    function verifyOwnership(address owner, uint256 propertyId) external view returns (bool);
}

interface ILoanProcessing {
    function isLoanApproved(address buyer) external view returns (bool);
}

interface IPropertyTransfer {
    function finalizeTransfer(address buyer, address seller, uint256 propertyId) external;
}

contract EscrowService {
    address public escrowAgent;
    IRealEstateToken public realEstateToken;
    ILoanProcessing public loanProcessing;
    IPropertyTransfer public propertyTransfer;

    struct Escrow {
        address buyer;
        address seller;
        uint256 propertyId;
        uint256 amount;
        bool fundsDeposited;
        bool completed;
    }

    mapping(uint256 => Escrow) public escrows; // Map propertyId to Escrow
    mapping(address => uint256) public balances; // Track buyer balances

    event DepositFunds(address indexed buyer, uint256 amount, uint256 propertyId);
    event ReleaseFunds(address indexed seller, uint256 amount, uint256 propertyId);
    event RefundFunds(address indexed buyer, uint256 amount, uint256 propertyId);

    modifier onlyEscrowAgent() {
        require(msg.sender == escrowAgent, "Only escrow agent can perform this action");
        _;
    }

    constructor(address _realEstateToken, address _loanProcessing, address _propertyTransfer) {
        escrowAgent = msg.sender;
        realEstateToken = IRealEstateToken(_realEstateToken);
        loanProcessing = ILoanProcessing(_loanProcessing);
        propertyTransfer = IPropertyTransfer(_propertyTransfer);
    }

    // Initiate an escrow for a property transaction
    function createEscrow(address _buyer, address _seller, uint256 _propertyId, uint256 _amount) external onlyEscrowAgent {
        require(!escrows[_propertyId].fundsDeposited, "Escrow already exists for this property");
        escrows[_propertyId] = Escrow({
            buyer: _buyer,
            seller: _seller,
            propertyId: _propertyId,
            amount: _amount,
            fundsDeposited: false,
            completed: false
        });
    }

    // Buyer deposits funds into escrow
    function depositFunds(uint256 propertyId) external payable {
        Escrow storage escrow = escrows[propertyId];
        require(msg.sender == escrow.buyer, "Only buyer can deposit funds");
        require(!escrow.fundsDeposited, "Funds already deposited for this escrow");
        require(msg.value == escrow.amount, "Incorrect deposit amount");

        balances[escrow.buyer] += msg.value;
        escrow.fundsDeposited = true;
        
        emit DepositFunds(escrow.buyer, msg.value, propertyId);
    }

    // Release funds to the seller upon successful property transfer
    function releaseFunds(uint256 propertyId) external onlyEscrowAgent {
        Escrow storage escrow = escrows[propertyId];
        require(escrow.fundsDeposited, "Funds not yet deposited");
        require(!escrow.completed, "Transaction already completed");

        // Verify ownership with RealEstateToken and loan approval with LoanProcessing
        require(realEstateToken.verifyOwnership(escrow.seller, propertyId), "Seller does not own the property");
        require(loanProcessing.isLoanApproved(escrow.buyer), "Loan not approved");

        // Complete the property transfer
        propertyTransfer.finalizeTransfer(escrow.buyer, escrow.seller, propertyId);

        // Transfer funds to seller
        balances[escrow.buyer] -= escrow.amount;
        escrow.completed = true;
        payable(escrow.seller).transfer(escrow.amount);

        emit ReleaseFunds(escrow.seller, escrow.amount, propertyId);
    }

    // Refund funds to the buyer if transaction is cancelled
    function refundFunds(uint256 propertyId) external onlyEscrowAgent {
        Escrow storage escrow = escrows[propertyId];
        require(escrow.fundsDeposited, "Funds not yet deposited");
        require(!escrow.completed, "Transaction already completed");

        // Refund to buyer
        balances[escrow.buyer] -= escrow.amount;
        escrow.completed = true;
        payable(escrow.buyer).transfer(escrow.amount);

        emit RefundFunds(escrow.buyer, escrow.amount, propertyId);
    }
    
    // Setters to update contract addresses if needed
    function updateRealEstateTokenAddress(address _newAddress) external onlyEscrowAgent {
        realEstateToken = IRealEstateToken(_newAddress);
    }

    function updateLoanProcessingAddress(address _newAddress) external onlyEscrowAgent {
        loanProcessing = ILoanProcessing(_newAddress);
    }

    function updatePropertyTransferAddress(address _newAddress) external onlyEscrowAgent {
        propertyTransfer = IPropertyTransfer(_newAddress);
    }
}
