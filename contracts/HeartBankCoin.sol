pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol";

contract HeartBankCoin is StandardToken {

    string public constant name = "HeartBank";
    string public constant symbol = "Kiitos";
    uint8 public constant decimals = 0;
    
    bool private airdrop;
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
    
    modifier onlyDuringAirDrop {
        require(airdrop);
        _;
    }

    constructor() public {
        airdrop = true;
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
    
    function toggleAirDrop() public onlyOwner returns (bool) {
        airdrop = !airdrop;
        return true;
    }
    
    function airDrop() public onlyDuringAirDrop returns (bool) {
        balances[owner] = balances[owner].sub(100);
        balances[msg.sender] = balances[msg.sender].add(100);
        emit Transfer(owner, msg.sender, 100);
        return true;
    }

}