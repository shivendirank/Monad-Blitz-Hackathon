// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./PizzaPass.sol";

contract ReflexGame {
    PizzaPass public pizzaPass;
    
    struct Round {
        uint256 startTime;
        uint256 windowDuration; // in milliseconds
        address winner;
        uint256 winTime; // reaction time in ms
        bool active;
        address[] participants;
    }
    
    uint256 public currentRoundId;
    mapping(uint256 => Round) public rounds;
    mapping(uint256 => mapping(address => bool)) public hasPlayed;
    
    event RoundStarted(uint256 indexed roundId, uint256 startTime);
    event ReactionSubmitted(uint256 indexed roundId, address indexed player, uint256 reactionTime);
    event RoundEnded(uint256 indexed roundId, address winner, uint256 winTime);
    
    constructor(address _pizzaPass) {
        pizzaPass = PizzaPass(_pizzaPass);
    }
    
    function startRound(uint256 windowMs) external {
        require(!rounds[currentRoundId].active, "Round already active");
        
        currentRoundId++;
        rounds[currentRoundId] = Round({
            startTime: block.timestamp,
            windowDuration: windowMs,
            winner: address(0),
            winTime: 0,
            active: true,
            participants: new address[](0)
        });
        
        emit RoundStarted(currentRoundId, block.timestamp);
    }
    
    function submitReaction() external {
        require(pizzaPass.hasPass(msg.sender), "Need Pizza Pass");
        
        Round storage round = rounds[currentRoundId];
        require(round.active, "No active round");
        require(!hasPlayed[currentRoundId][msg.sender], "Already played");
        
        uint256 elapsed = (block.timestamp - round.startTime) * 1000; // convert to ms
        uint256 windowEnd = round.windowDuration;
        
        require(elapsed <= windowEnd, "Too late");
        
        hasPlayed[currentRoundId][msg.sender] = true;
        round.participants.push(msg.sender);
        
        // First submission wins
        if (round.winner == address(0)) {
            round.winner = msg.sender;
            round.winTime = elapsed;
        }
        
        emit ReactionSubmitted(currentRoundId, msg.sender, elapsed);
    }
    
    function endRound() external {
        Round storage round = rounds[currentRoundId];
        require(round.active, "Round not active");
        
        round.active = false;
        emit RoundEnded(currentRoundId, round.winner, round.winTime);
    }
    
    function getRoundInfo(uint256 roundId) external view returns (
        uint256 startTime,
        address winner,
        uint256 winTime,
        bool active,
        uint256 participantCount
    ) {
        Round memory round = rounds[roundId];
        return (
            round.startTime,
            round.winner,
            round.winTime,
            round.active,
            round.participants.length
        );
    }
}

