pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol";

contract HeartBankToken is StandardToken {

    string public constant name = "HeartBank Kiitos";
    string public constant symbol = "H3K";
    uint8 public constant decimals = 0;
    
    address private owner;
    mapping (address => bool) private admins;
    
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
        totalSupply_ = 1 ether;
        balances[owner] = totalSupply_;
    }
    
    function addAdmin(address admin) public onlyOwner returns (bool) {
        admins[admin] = true;
        return true;
    }
    
    function transferToAdmin(address holder, uint kiitos) external onlyAdmin returns (bool) {
        require(balances[holder] >= kiitos);
        balances[holder] = balances[holder].sub(kiitos);
        balances[msg.sender] = balances[msg.sender].add(kiitos);
        emit Transfer(holder, msg.sender, kiitos);
        return true;
    }

}