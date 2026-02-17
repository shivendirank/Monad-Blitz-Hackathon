// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./PizzaPass.sol";
import "./ReflexGame.sol";

contract PredictionMarket {
    PizzaPass public pizzaPass;
    ReflexGame public reflexGame;
    
    struct Team {
        string name;
        uint256 totalBets;
        address[] bettors;
    }
    
    struct Bet {
        uint256 amount;
        uint256 teamId;
        uint256 multiplier; // from reflex game score
    }
    
    Team[] public teams;
    mapping(address => Bet) public bets;
    mapping(uint256 => mapping(address => uint256)) public teamBets;
    
    uint256 public totalPot;
    uint256 public winningTeamId;
    bool public resolved;
    
    event TeamAdded(uint256 indexed teamId, string name);
    event BetPlaced(address indexed bettor, uint256 teamId, uint256 amount, uint256 multiplier);
    event MarketResolved(uint256 winningTeamId, uint256 totalPayout);
    event WinningsClaimed(address indexed winner, uint256 amount);
    
    constructor(address _pizzaPass, address _reflexGame) {
        pizzaPass = PizzaPass(_pizzaPass);
        reflexGame = ReflexGame(_reflexGame);
    }
    
    function addTeam(string memory name) external {
        teams.push(Team({
            name: name,
            totalBets: 0,
            bettors: new address[](0)
        }));
        emit TeamAdded(teams.length - 1, name);
    }
    
    function placeBet(uint256 teamId) external payable {
        require(pizzaPass.hasPass(msg.sender), "Need Pizza Pass");
        require(teamId < teams.length, "Invalid team");
        require(!resolved, "Market resolved");
        require(bets[msg.sender].amount == 0, "Already bet");
        require(msg.value > 0, "Must bet something");
        
        // Get multiplier from reflex game performance (simplified)
        uint256 multiplier = 100; // base 1.0x (100 = 1.0x, 150 = 1.5x)
        
        bets[msg.sender] = Bet({
            amount: msg.value,
            teamId: teamId,
            multiplier: multiplier
        });
        
        teams[teamId].totalBets += msg.value;
        teams[teamId].bettors.push(msg.sender);
        teamBets[teamId][msg.sender] = msg.value;
        totalPot += msg.value;
        
        emit BetPlaced(msg.sender, teamId, msg.value, multiplier);
    }
    
    function resolveMarket(uint256 _winningTeamId) external {
        require(!resolved, "Already resolved");
        require(_winningTeamId < teams.length, "Invalid team");
        
        winningTeamId = _winningTeamId;
        resolved = true;
        
        emit MarketResolved(_winningTeamId, totalPot);
    }
    
    function claimWinnings() external {
        require(resolved, "Not resolved");
        
        Bet memory userBet = bets[msg.sender];
        require(userBet.teamId == winningTeamId, "Not a winner");
        require(userBet.amount > 0, "No bet placed");
        
        Team memory winningTeam = teams[winningTeamId];
        
        // Calculate payout: (user bet / team total) * total pot * multiplier
        uint256 share = (userBet.amount * totalPot * userBet.multiplier) / (winningTeam.totalBets * 100);
        
        // Mark as claimed
        bets[msg.sender].amount = 0;
        
        payable(msg.sender).transfer(share);
        emit WinningsClaimed(msg.sender, share);
    }
    
    function getTeamCount() external view returns (uint256) {
        return teams.length;
    }
    
    function getTeamInfo(uint256 teamId) external view returns (string memory name, uint256 totalBets, uint256 bettorCount) {
        Team memory team = teams[teamId];
        return (team.name, team.totalBets, team.bettors.length);
    }
}

