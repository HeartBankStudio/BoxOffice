pragma solidity ^0.4.24;

contract OracleStorage {
    
    address public owner;
    mapping (address => bool) private admins;
    
    uint public usdPriceOfEth;
    
    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }
    
    modifier onlyAdmin {
        require(admins[msg.sender]);
        _;
    }
    
    constructor() public {
        owner = msg.sender;
        usdPriceOfEth = 1;
    }
    
    function addAdmin(address admin) public onlyOwner returns (bool) {
        admins[admin] = true;
        return true;
    }
    
    function usdPriceOfEth(uint price) public onlyAdmin returns (bool) {
        usdPriceOfEth = price;
        return true;
    }
    
    function kill() public onlyOwner {
        selfdestruct(owner);
    }
    
}