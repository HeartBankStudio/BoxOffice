pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol";

contract BoxOfficeMovie is StandardToken {

    uint8 public constant decimals = 0;
    string public name;
    string public symbol;
    address private boxOffice;
    
    modifier onlyBoxOffice {
        require(msg.sender == boxOffice);
        _;
    }

    constructor(
        address filmmaker,
        uint ticketSupply, 
        string movieName, 
        string ticketSymbol
    ) 
        public 
    {
        boxOffice = msg.sender;
        totalSupply_ = ticketSupply;
        balances[filmmaker] = ticketSupply;
        allowed[filmmaker][boxOffice] = ticketSupply;
        name = movieName;
        symbol = ticketSymbol;
    }
    
    function updateMovieName(string movieName) external onlyBoxOffice returns (bool) {
        name = movieName;
        return true;
    }
    
    function updateTicketSymbol(string ticketSymbol) external onlyBoxOffice returns (bool) {
        symbol = ticketSymbol;
        return true;
    }
    
    function transferToBoxOffice(address holder, uint tickets) external onlyBoxOffice returns (bool) {
        require(tickets <= balances[holder]);
        balances[holder] = balances[holder].sub(tickets);
        balances[boxOffice] = balances[boxOffice].add(tickets);
        emit Transfer(holder, boxOffice, tickets);
        return true;
    }

}