pragma solidity ^0.4.24;

contract BoxOfficeOracle {
    
    address public admin;
    uint public usdPriceOfEth;
    
    event GetPrice();
    event PriceUpdated(uint price);
    
    function updatePrice() public {
        emit GetPrice();
    }
    
    function setPrice(uint price) public returns (bool) {
        require(msg.sender == admin);
        usdPriceOfEth = price;
        emit PriceUpdated(price);
        return true;
    }
    
    function getUsdPriceOfWei() public view returns (uint) {
        return usdPriceOfEth / 1 ether;
    }
    
}