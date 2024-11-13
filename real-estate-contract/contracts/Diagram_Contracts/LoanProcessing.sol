// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LoanProcessing {
    address public admin;
    uint256 public interestRate; // Interest rate in percentage
    mapping(address => Loan) public loans;

    struct Loan {
        bool isApproved;
        bool isRepaid;
        uint256 amount;
        uint256 propertyId;
        uint256 termInMonths;
        uint256 monthlyInstallment;
    }

    event LoanApplied(address indexed buyer, uint256 propertyId, uint256 amount);
    event LoanApproved(address indexed buyer, uint256 propertyId);
    event LoanRejected(address indexed buyer, uint256 propertyId);
    event LoanRepaid(address indexed buyer, uint256 propertyId);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    constructor(uint256 _interestRate) {
        admin = msg.sender;
        interestRate = _interestRate;
    }

    function applyForLoan(address buyer, uint256 propertyId, uint256 amount, uint256 termInMonths) external {
        require(loans[buyer].amount == 0, "Loan already exists for this buyer");

        uint256 monthlyInstallment = (amount + (amount * interestRate / 100)) / termInMonths;
        loans[buyer] = Loan(false, false, amount, propertyId, termInMonths, monthlyInstallment);

        emit LoanApplied(buyer, propertyId, amount);
    }

    function approveLoan(address buyer) external onlyAdmin {
        require(!loans[buyer].isApproved, "Loan already approved");
        loans[buyer].isApproved = true;
        emit LoanApproved(buyer, loans[buyer].propertyId);
    }

    function rejectLoan(address buyer) external onlyAdmin {
        loans[buyer].isApproved = false;
        loans[buyer].isRepaid = true; // Close out loan if rejected
        emit LoanRejected(buyer, loans[buyer].propertyId);
    }

    function repayLoan(address buyer) external onlyAdmin {
        require(loans[buyer].isApproved, "Loan not approved");
        loans[buyer].isRepaid = true;
        emit LoanRepaid(buyer, loans[buyer].propertyId);
    }

    function isLoanApproved(address buyer) external view returns (bool) {
        return loans[buyer].isApproved && !loans[buyer].isRepaid;
    }
}
