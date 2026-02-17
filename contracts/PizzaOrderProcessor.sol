// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract PizzaOrderProcessor {
    enum PizzaType { Pepperoni, Margherita, Hawaiian, BBQChicken, Supreme, Veggie }
    
    struct PizzaOrder {
        address customer;
        PizzaType pizzaType;
        uint256 timestamp;
        uint256 blockNumber;
    }
    
    // Separate storage slots for parallel execution
    mapping(address => PizzaOrder[]) public customerOrders;
    mapping(uint256 => uint256) public blockOrderCount;
    
    PizzaOrder[] public allOrders;
    
    event OrderProcessed(address indexed customer, PizzaType pizzaType, uint256 orderId, uint256 blockNumber);
    event BatchProcessed(uint256 orderCount, uint256 blockNumber);
    
    function placeOrder(PizzaType pizzaType) external {
        PizzaOrder memory order = PizzaOrder({
            customer: msg.sender,
            pizzaType: pizzaType,
            timestamp: block.timestamp,
            blockNumber: block.number
        });
        
        customerOrders[msg.sender].push(order);
        allOrders.push(order);
        blockOrderCount[block.number]++;
        
        emit OrderProcessed(msg.sender, pizzaType, allOrders.length - 1, block.number);
    }
    
    // For demo: batch process multiple orders from different addresses
    function batchProcessOrders(
        address[] calldata customers,
        PizzaType[] calldata pizzaTypes
    ) external {
        require(customers.length == pizzaTypes.length, "Length mismatch");
        
        for (uint256 i = 0; i < customers.length; i++) {
            PizzaOrder memory order = PizzaOrder({
                customer: customers[i],
                pizzaType: pizzaTypes[i],
                timestamp: block.timestamp,
                blockNumber: block.number
            });
            
            customerOrders[customers[i]].push(order);
            allOrders.push(order);
        }
        
        blockOrderCount[block.number] += customers.length;
        emit BatchProcessed(customers.length, block.number);
    }
    
    function getCustomerOrders(address customer) external view returns (PizzaOrder[] memory) {
        return customerOrders[customer];
    }
    
    function getBlockStats(uint256 blockNumber) external view returns (uint256) {
        return blockOrderCount[blockNumber];
    }
    
    function getTotalOrders() external view returns (uint256) {
        return allOrders.length;
    }
}

