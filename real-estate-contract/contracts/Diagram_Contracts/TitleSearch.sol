// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TitleSearch {
    address public admin;

    struct TitleRecord {
        uint256 propertyId;
        address currentOwner;
        bool isClear;
        string[] history; // Array of previous ownership records
        bool hasClaims; // Flag if there are any claims or disputes
    }

    mapping(uint256 => TitleRecord) public titleRecords;

    event TitleCleared(uint256 propertyId);
    event TitleFlagged(uint256 propertyId);
    event TitleHistoryUpdated(uint256 propertyId, string record);
    event ClaimAdded(uint256 propertyId, string claimDetails);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function initializeTitle(uint256 propertyId) external onlyAdmin {
        require(titleRecords[propertyId].propertyId == 0, "Title already initialized");
        titleRecords[propertyId].isClear = false;
    }

    function updateTitleOwner(uint256 propertyId, address newOwner) external onlyAdmin {
        require(titleRecords[propertyId].isClear, "Title must be clear to transfer ownership");
        titleRecords[propertyId].currentOwner = newOwner;
        titleRecords[propertyId].history.push(string(abi.encodePacked("Transferred to ", toAsciiString(newOwner))));
        emit TitleHistoryUpdated(propertyId, "Ownership transferred");
    }

    function clearTitle(uint256 propertyId) external onlyAdmin {
        titleRecords[propertyId].isClear = true;
        titleRecords[propertyId].hasClaims = false;
        emit TitleCleared(propertyId);
    }

    function flagTitle(uint256 propertyId) external onlyAdmin {
        titleRecords[propertyId].isClear = false;
        emit TitleFlagged(propertyId);
    }

    function addClaim(uint256 propertyId, string calldata claimDetails) external onlyAdmin {
        titleRecords[propertyId].hasClaims = true;
        titleRecords[propertyId].isClear = false;
        emit ClaimAdded(propertyId, claimDetails);
    }

    function isTitleClear(uint256 propertyId) external view returns (bool) {
        return titleRecords[propertyId].isClear && !titleRecords[propertyId].hasClaims;
    }

    function getTitleHistory(uint256 propertyId) external view returns (string[] memory) {
        return titleRecords[propertyId].history;
    }

    // Helper function to convert address to string (for history tracking)
    function toAsciiString(address x) internal pure returns (string memory) {
        bytes memory s = new bytes(40);
        for (uint i = 0; i < 20; i++) {
            bytes1 b = bytes1(uint8(uint(uint160(x)) / (2 ** (8 * (19 - i)))));
            bytes1 hi = bytes1(uint8(b) / 16);
            bytes1 lo = bytes1(uint8(b) - 16 * uint8(hi));
            s[2 * i] = char(hi);
            s[2 * i + 1] = char(lo);
        }
        return string(abi.encodePacked("0x", s));
    }

    function char(bytes1 b) internal pure returns (bytes1 c) {
        if (uint8(b) < 10) return bytes1(uint8(b) + 0x30);
        else return bytes1(uint8(b) + 0x57);
    }
}
