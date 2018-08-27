pragma solidity ^0.4.24;

contract OracleRegistry {
    
    address public owner;
    address public currentOracle;
    address[] public previousOracles;
    
    event OracleUpgraded(address newOracle);
    
    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    constructor(address oracle) public {
        owner = msg.sender;
        currentOracle = oracle;
    }

    function upgradeOracle(address newOracle) public onlyOwner returns (bool) {
        if(newOracle != currentOracle) {
            previousOracles.push(currentOracle);
            currentOracle = newOracle;
            emit OracleUpgraded(newOracle);
            return true;
        }
        return false;
    }
    
    function kill() public onlyOwner {
        selfdestruct(owner);
    }
    
}