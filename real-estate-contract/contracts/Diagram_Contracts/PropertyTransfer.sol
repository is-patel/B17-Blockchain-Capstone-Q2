// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IRealEstateToken {
    function transferOwnership(uint256 propertyId, address newOwner) external;
    function verifyOwnership(address owner, uint256 propertyId) external view returns (bool);
}

interface ITitleSearch {
    function isTitleClear(uint256 propertyId) external view returns (bool);
}

interface ILoanProcessing {
    function isLoanApproved(address buyer) external view returns (bool);
}

interface IKYCIdentity {
    function isFullyVerified(address participant) external view returns (bool);
}

interface ITitleInsurance {
    function verifyInsurance(uint256 propertyId) external view returns (bool);
}

contract PropertyTransfer {
    address public admin;
    IRealEstateToken public realEstateToken;
    ITitleSearch public titleSearch;
    ILoanProcessing public loanProcessing;
    IKYCIdentity public kycIdentity;
    ITitleInsurance public titleInsurance;

    event PropertyTransferred(address buyer, address seller, uint256 propertyId);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    constructor(
        address _realEstateToken,
        address _titleSearch,
        address _loanProcessing,
        address _kycIdentity,
        address _titleInsurance
    ) {
        admin = msg.sender;
        realEstateToken = IRealEstateToken(_realEstateToken);
        titleSearch = ITitleSearch(_titleSearch);
        loanProcessing = ILoanProcessing(_loanProcessing);
        kycIdentity = IKYCIdentity(_kycIdentity);
        titleInsurance = ITitleInsurance(_titleInsurance);
    }

    function finalizeTransfer(address buyer, address seller, uint256 propertyId) external onlyAdmin {
        // Verify buyer and seller KYC
        require(kycIdentity.isFullyVerified(buyer), "Buyer is not KYC verified");
        require(kycIdentity.isFullyVerified(seller), "Seller is not KYC verified");

        // Verify title clearance
        require(titleSearch.isTitleClear(propertyId), "Title is not clear");

        // Verify loan approval if the buyer requires financing
        require(loanProcessing.isLoanApproved(buyer), "Loan is not approved for the buyer");

        // Verify insurance coverage for the property
        require(titleInsurance.verifyInsurance(propertyId), "Property is not insured");

        // Transfer ownership in RealEstateToken contract
        require(realEstateToken.verifyOwnership(seller, propertyId), "Seller does not own the property");
        realEstateToken.transferOwnership(propertyId, buyer);

        emit PropertyTransferred(buyer, seller, propertyId);
    }
}
