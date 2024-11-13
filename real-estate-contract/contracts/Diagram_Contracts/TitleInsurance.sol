// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TitleInsurance {
    address public admin;
    mapping(uint256 => InsurancePolicy) public policies;

    struct InsurancePolicy {
        bool isActive;
        uint256 coverageAmount;
        uint256 expiration;
    }

    event InsuranceIssued(uint256 propertyId, uint256 coverageAmount, uint256 expiration);
    event InsuranceRevoked(uint256 propertyId);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function issueInsurance(uint256 propertyId, uint256 coverageAmount, uint256 durationInDays) external onlyAdmin {
        policies[propertyId] = InsurancePolicy(true, coverageAmount, block.timestamp + (durationInDays * 1 days));
        emit InsuranceIssued(propertyId, coverageAmount, block.timestamp + (durationInDays * 1 days));
    }

    function revokeInsurance(uint256 propertyId) external onlyAdmin {
        policies[propertyId].isActive = false;
        emit InsuranceRevoked(propertyId);
    }

    function verifyInsurance(uint256 propertyId) external view returns (bool) {
        return policies[propertyId].isActive && policies[propertyId].expiration > block.timestamp;
    }
}
