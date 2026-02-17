// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PizzaPass is ERC721, Ownable {
    uint256 private _tokenIdCounter;
    
    // Soulbound: track if transferred (disallow)
    mapping(uint256 => bool) public locked;
    
    // Pizza receipt metadata
    struct Receipt {
        string imageURI;
        uint256 mintedAt;
        address minter;
    }
    
    mapping(uint256 => Receipt) public receipts;
    
    event PizzaPassMinted(address indexed user, uint256 tokenId, string imageURI);
    
    constructor() ERC721("Monad Pizza Pass", "PIZZA") Ownable(msg.sender) {}
    
    function mintPass(string memory imageURI) external returns (uint256) {
        require(balanceOf(msg.sender) == 0, "Already has pass");
        
        uint256 tokenId = _tokenIdCounter++;
        _safeMint(msg.sender, tokenId);
        
        locked[tokenId] = true;
        receipts[tokenId] = Receipt(imageURI, block.timestamp, msg.sender);
        
        emit PizzaPassMinted(msg.sender, tokenId, imageURI);
        return tokenId;
    }
    
    // Override transfer to make soulbound
    function _update(address to, uint256 tokenId, address auth) 
        internal 
        override 
        returns (address) 
    {
        address from = _ownerOf(tokenId);
        if (from != address(0) && to != address(0)) {
            require(!locked[tokenId], "Soulbound: cannot transfer");
        }
        return super._update(to, tokenId, auth);
    }
    
    function hasPass(address user) external view returns (bool) {
        return balanceOf(user) > 0;
    }
}

