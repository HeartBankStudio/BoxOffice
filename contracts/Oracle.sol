pragma solidity ^0.4.24;

import {OracleLibrary as Library} from "./OracleLibrary.sol";

contract Oracle {
    
    using Library for address;
    
    address public owner;
    address public oracle;
    
    event GetPrice();
    event PriceUpdated(uint price);
    
    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }
    
    constructor(address oracleStorage) public {
        owner = msg.sender;
        oracle = oracleStorage;
    }
    
    function updatePrice() public onlyOwner returns (bool) {
        emit GetPrice();
        return true;
    }
    
    function setPrice(uint price) public onlyOwner returns (bool) {
        oracle.usdPriceOfEth(price);
        emit PriceUpdated(price);
        return true;
    }
    
    function usdPriceOfEth() public view returns (uint) {
        return oracle.usdPriceOfEth();
    }
    
    function convertToUsd(uint amountInWei) public view returns (uint) {
        return usdPriceOfEth() * amountInWei / 1 ether;
    }
    
    function kill() public onlyOwner {
        selfdestruct(owner);
    }
    
}