// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Cartified1155 is ERC1155, Ownable {
    uint256 public currentTokenId = 0;

    struct Order {
        string ipfsURI;
        bool delivered;
    }

    mapping(uint256 => Order) public orders;

    event OrderMinted(address indexed to, uint256 tokenId, string ipfsURI);
    event OrderBurned(address indexed from, uint256 tokenId);
    event OrderDelivered(uint256 indexed tokenId);

    constructor() ERC1155("") Ownable(msg.sender) {}


    /**
     * @notice Mint an order token by anyone with valid IPFS metadata
     * @param ipfsURI IPFS metadata URI (json)
     */
    function mintOrder(string memory ipfsURI) external {
        require(bytes(ipfsURI).length > 0, "IPFS URI required");

        currentTokenId++;
        uint256 tokenId = currentTokenId;

        _mint(msg.sender, tokenId, 1, "");
        orders[tokenId] = Order(ipfsURI, false);

        emit OrderMinted(msg.sender, tokenId, ipfsURI);
    }

    /**
     * @notice Marks an order as delivered and burns the token
     * Can only be called by the token owner
     */
    function confirmDelivery(uint256 tokenId) external {
        require(balanceOf(msg.sender, tokenId) > 0, "You don't own this token");
        require(!orders[tokenId].delivered, "Already delivered");

        _burn(msg.sender, tokenId, 1);
        orders[tokenId].delivered = true;

        emit OrderBurned(msg.sender, tokenId);
        emit OrderDelivered(tokenId);
    }

    /**
     * @notice Return delivery status of an order
     */
    function getOrderStatus(uint256 tokenId) external view returns (bool) {
        return orders[tokenId].delivered;
    }

    /**
     * @notice IPFS URI per token
     */
    function uri(uint256 tokenId) public view override returns (string memory) {
        return orders[tokenId].ipfsURI;
    }
}
