// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract KYCIdentity {
    address public admin;
    mapping(address => Participant) public participants;

    struct Participant {
        bool isBasicVerified;
        bool isEnhancedVerified;
        uint8 rating; // Rating for compliance (1-5)
    }

    event BasicVerified(address indexed participant);
    event EnhancedVerified(address indexed participant);
    event VerificationRevoked(address indexed participant);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function basicVerify(address participant) external onlyAdmin {
        participants[participant].isBasicVerified = true;
        emit BasicVerified(participant);
    }

    function enhancedVerify(address participant) external onlyAdmin {
        require(participants[participant].isBasicVerified, "Basic verification required first");
        participants[participant].isEnhancedVerified = true;
        emit EnhancedVerified(participant);
    }

    function revokeVerification(address participant) external onlyAdmin {
        participants[participant] = Participant(false, false, 0);
        emit VerificationRevoked(participant);
    }

    function setComplianceRating(address participant, uint8 rating) external onlyAdmin {
        require(rating >= 1 && rating <= 5, "Rating must be between 1 and 5");
        participants[participant].rating = rating;
    }

    function isFullyVerified(address participant) external view returns (bool) {
        return participants[participant].isBasicVerified && participants[participant].isEnhancedVerified;
    }
}
