// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RealEstateToken {
    address public admin;
    uint256 public nextTokenId;
    mapping(uint256 => address) public propertyOwner;
    mapping(uint256 => Property) public properties;
    
    struct Property {
        uint256 propertyId;
        address owner;
        uint256 appraisalValue;
        bool isListedForSale;
    }

    event PropertyTokenized(uint256 propertyId, address owner, uint256 appraisalValue);
    event OwnershipTransferred(uint256 propertyId, address newOwner);
    event PropertyListed(uint256 propertyId, uint256 price);
    event PropertyDelisted(uint256 propertyId);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    modifier onlyOwner(uint256 propertyId) {
        require(propertyOwner[propertyId] == msg.sender, "Only owner can perform this action");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function tokenizeProperty(address owner, uint256 appraisalValue) external onlyAdmin returns (uint256) {
        uint256 propertyId = nextTokenId++;
        properties[propertyId] = Property(propertyId, owner, appraisalValue, false);
        propertyOwner[propertyId] = owner;
        emit PropertyTokenized(propertyId, owner, appraisalValue);
        return propertyId;
    }

    function transferOwnership(uint256 propertyId, address newOwner) external onlyAdmin {
        require(properties[propertyId].isListedForSale, "Property must be listed for sale to transfer ownership");
        propertyOwner[propertyId] = newOwner;
        properties[propertyId].owner = newOwner;
        properties[propertyId].isListedForSale = false;
        emit OwnershipTransferred(propertyId, newOwner);
    }

    function listPropertyForSale(uint256 propertyId, uint256 appraisalValue) external onlyOwner(propertyId) {
        properties[propertyId].appraisalValue = appraisalValue;
        properties[propertyId].isListedForSale = true;
        emit PropertyListed(propertyId, appraisalValue);
    }

    function delistProperty(uint256 propertyId) external onlyOwner(propertyId) {
        properties[propertyId].isListedForSale = false;
        emit PropertyDelisted(propertyId);
    }

    function verifyOwnership(address owner, uint256 propertyId) external view returns (bool) {
        return propertyOwner[propertyId] == owner;
    }
}
