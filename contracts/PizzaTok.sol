// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PizzaTok is ERC20, Ownable {
    uint256 public constant CONFESSION_REWARD = 50 * 10 ** 18; // 50 tokens with 18 decimals
    uint256 public constant REPLY_REWARD = 25 * 10 ** 18;      // 25 tokens with 18 decimals
    
    // Track confessions posted
    mapping(address => uint256) public confessionCount;
    mapping(address => uint256) public replyCount;
    
    // Event for confession rewards
    event ConfessionReward(address indexed user, uint256 amount, string confessionId);
    event ReplyReward(address indexed user, uint256 amount, string replyId);
    
    constructor() ERC20("PizzaTok", "🍕TOK") {
        // Mint initial supply to contract owner for distribution
        _mint(msg.sender, 1000000 * 10 ** 18); // 1 million tokens
    }
    
    /**
     * @dev Mint tokens for a new confession (backend only)
     * @param to Address to mint tokens to
     * @param confessionId Unique confession identifier
     */
    function mintConfessionReward(address to, string memory confessionId) 
        public 
        onlyOwner 
    {
        require(to != address(0), "Invalid address");
        _mint(to, CONFESSION_REWARD);
        confessionCount[to]++;
        emit ConfessionReward(to, CONFESSION_REWARD, confessionId);
    }
    
    /**
     * @dev Mint tokens for a reply (backend only)
     * @param to Address to mint tokens to
     * @param replyId Unique reply identifier
     */
    function mintReplyReward(address to, string memory replyId) 
        public 
        onlyOwner 
    {
        require(to != address(0), "Invalid address");
        _mint(to, REPLY_REWARD);
        replyCount[to]++;
        emit ReplyReward(to, REPLY_REWARD, replyId);
    }
    
    /**
     * @dev Batch mint for multiple confessions/replies
     * @param recipients Array of addresses
     * @param amounts Array of amounts to mint
     */
    function batchMint(address[] memory recipients, uint256[] memory amounts) 
        public 
        onlyOwner 
    {
        require(recipients.length == amounts.length, "Array length mismatch");
        for (uint256 i = 0; i < recipients.length; i++) {
            require(recipients[i] != address(0), "Invalid address");
            _mint(recipients[i], amounts[i]);
        }
    }
    
    /**
     * @dev Get user's token balance (for frontend)
     */
    function getUserBalance(address user) public view returns (uint256) {
        return balanceOf(user);
    }
    
    /**
     * @dev Get user's confession stats
     */
    function getUserStats(address user) 
        public 
        view 
        returns (uint256 confessions, uint256 replies, uint256 totalTokens) 
    {
        confessions = confessionCount[user];
        replies = replyCount[user];
        totalTokens = balanceOf(user);
    }
}
