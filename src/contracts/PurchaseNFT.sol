// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Cartified1155 is ERC1155URIStorage, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;
    address public platformWallet;

    struct Order {
        address buyer;
        uint256 amount;
        bool isDelivered;
        bool isBurned;
    }

    mapping(uint256 => Order) public orders;

    event OrderPlaced(address indexed buyer, uint256 indexed tokenId, uint256 amount);
    event OrderDelivered(uint256 indexed tokenId);
    event OrderBurned(uint256 indexed tokenId);
    event PaymentReleased(address indexed to, uint256 amount);

    constructor(string memory baseURI, address _platformWallet)
        ERC1155(baseURI)
        Ownable(msg.sender)
    {
        require(_platformWallet != address(0), "Invalid platform wallet");
        platformWallet = _platformWallet;
    }

    function placeOrder(string memory tokenURI) external payable nonReentrant {
        require(msg.value > 0, "Payment required");

        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _mint(msg.sender, newTokenId, 1, "");
        _setURI(newTokenId, tokenURI);

        orders[newTokenId] = Order({
            buyer: msg.sender,
            amount: msg.value,
            isDelivered: false,
            isBurned: false
        });

        emit OrderPlaced(msg.sender, newTokenId, msg.value);
    }

    function confirmDelivery(uint256 tokenId) external nonReentrant {
        Order storage order = orders[tokenId];
        require(order.buyer != address(0), "Invalid order");
        require(!order.isDelivered, "Already delivered");
        require(balanceOf(order.buyer, tokenId) > 0, "Buyer does not own token");

        order.isDelivered = true;
        emit OrderDelivered(tokenId);
    }

    function burnOrder(uint256 tokenId) external nonReentrant {
        Order storage order = orders[tokenId];
        require(order.buyer != address(0), "Invalid order");
        require(order.isDelivered, "Order not marked delivered");
        require(!order.isBurned, "Already burned");
        require(balanceOf(order.buyer, tokenId) > 0, "Buyer doesn't own the token");

        _burn(order.buyer, tokenId, 1);
        order.isBurned = true;

        (bool success, ) = platformWallet.call{value: order.amount}("");
        require(success, "Payment release failed");

        emit OrderBurned(tokenId);
        emit PaymentReleased(platformWallet, order.amount);
    }

    function getOrderDetails(uint256 tokenId) external view returns (Order memory) {
        return orders[tokenId];
    }
}
