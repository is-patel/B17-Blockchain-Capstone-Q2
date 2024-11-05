// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract RealEstateTransaction is Ownable, ReentrancyGuard {
    enum Role { Buyer, Seller, Agent, Lender }

    struct Participant {
        address payable account;
        Role role;
    }

    struct Property {
        uint256 id;
        string description;
        uint256 price;
        address payable owner;
        bool isListed;
    }

    struct Offer {
        uint256 propertyId;
        address payable buyer;
        uint256 offerPrice;
        bool isAccepted;
    }

    struct Escrow {
        uint256 propertyId;
        address payable buyer;
        address payable seller;
        uint256 amount;
        bool fundsReleased;
    }

    uint256 public propertyCount;

    mapping(uint256 => Property) public properties;
    mapping(uint256 => Offer[]) public offers;
    mapping(uint256 => Escrow) public escrows;
    mapping(address => Participant) public participants;

    event PropertyListed(uint256 propertyId, address owner, uint256 price);
    event OfferMade(uint256 propertyId, address buyer, uint256 offerPrice);
    event OfferAccepted(uint256 propertyId, address buyer, uint256 offerPrice);
    event FundsReleased(uint256 propertyId, uint256 amount);

    // Constructor that calls Ownable's constructor
    constructor() Ownable() {
        // Any additional initialization can be done here
    }

    function register(Role _role) public {
        participants[msg.sender] = Participant(payable(msg.sender), _role);
    }

    function listProperty(string memory _description, uint256 _price) public {
        require(participants[msg.sender].role == Role.Seller, "Only sellers can list properties");

        propertyCount++;
        properties[propertyCount] = Property(
            propertyCount,
            _description,
            _price,
            payable(msg.sender),
            true
        );

        emit PropertyListed(propertyCount, msg.sender, _price);
    }

    function makeOffer(uint256 _propertyId) public payable {
        Property memory property = properties[_propertyId];

        require(property.isListed, "Property not listed");
        require(msg.value > 0, "Offer must have a positive value");
        require(participants[msg.sender].role == Role.Buyer, "Only buyers can make offers");

        offers[_propertyId].push(Offer(
            _propertyId,
            payable(msg.sender),
            msg.value,
            false
        ));

        emit OfferMade(_propertyId, msg.sender, msg.value);
    }

    function acceptOffer(uint256 _propertyId, uint256 _offerIndex) public {
        Property storage property = properties[_propertyId];
        Offer storage offer = offers[_propertyId][_offerIndex];

        require(msg.sender == property.owner, "Only the property owner can accept offers");
        require(property.isListed, "Property is not listed");
        require(!offer.isAccepted, "Offer already accepted");

        offer.isAccepted = true;

        // Initiate escrow
        escrows[_propertyId] = Escrow(
            _propertyId,
            offer.buyer,
            property.owner,
            offer.offerPrice,
            false
        );

        emit OfferAccepted(_propertyId, offer.buyer, offer.offerPrice);
    }

    function releaseFunds(uint256 _propertyId) public {
        Escrow storage escrow = escrows[_propertyId];
        Property storage property = properties[_propertyId];

        require(!escrow.fundsReleased, "Funds already released");
        require(
            msg.sender == escrow.buyer || msg.sender == escrow.seller,
            "Only buyer or seller can release funds"
        );

        // Placeholder for additional checks (e.g., title verification)

        // Transfer funds to the seller
        escrow.seller.transfer(escrow.amount);
        escrow.fundsReleased = true;

        // Transfer property ownership
        property.owner = escrow.buyer;
        property.isListed = false;

        emit FundsReleased(_propertyId, escrow.amount);
    }
}
