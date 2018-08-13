pragma solidity ^0.4.24;

contract BoxOfficeOracle {
    
    address public owner;
    uint public usdPriceOfEth;
    
    event GetPrice();
    event PriceUpdated(uint price);
    
    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }
    
    constructor() public {
        owner = msg.sender;
        usdPriceOfEth = 354;
    }
    
    function updatePrice() public returns (bool) {
        emit GetPrice();
        return true;
    }
    
    function setPrice(uint price) public onlyOwner returns (bool) {
        usdPriceOfEth = price;
        emit PriceUpdated(price);
        return true;
    }
    
    function convertToUsd(uint amountInWei) public view returns (uint) {
        return usdPriceOfEth * amountInWei / 1 ether;
    }
    
    function kill() public onlyOwner {
        selfdestruct(owner);
    }
    
}