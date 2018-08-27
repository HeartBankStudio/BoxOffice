pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol";

contract BoxOfficeMovie is StandardToken {

    uint8 public constant decimals = 0;
    string public name;
    string public symbol;
    
    address public boxOffice;
    address public filmmaker;
    address[] public audienceMembers;
    
    uint public createdTime;
    uint public salesEndDate;
    uint public availableTickets;
    uint public price;
    uint public sales;
    uint public fund;
    string public logline; 
    string public poster; 
    string public trailer;
    
    event FilmUpdated(
        uint salesEndDate,
        uint availableTickets,
        uint price,
        string movieName,
        string ticketSymbol,
        string logline,
        string poster,
        string trailer
    );
    
    event TicketSpent(
        address indexed holder
    );
    
    modifier onlyBoxOffice {
        require(msg.sender == boxOffice);
        _;
    }
    
    modifier onlyFilmmaker {
        require(msg.sender == filmmaker);
        _;
    }
    
    modifier onlyTicketHolder {
        require(balanceOf(msg.sender) > 0);
        _;
    }

    constructor(
        address _filmmaker,
        uint _salesEndDate,
        uint _availableTickets,
        uint _price,
        uint _ticketSupply, 
        string _movieName, 
        string _ticketSymbol,
        string _logline,
        string _poster,
        string _trailer
    ) 
        public 
    {
        boxOffice = msg.sender;
        filmmaker = _filmmaker;
        
        createdTime = now;
        sales = 0;
        fund = 0;
        
        salesEndDate = _salesEndDate;
        availableTickets = _availableTickets;
        price = _price;
        totalSupply_ = _ticketSupply;
        name = _movieName;
        symbol = _ticketSymbol;
        logline = _logline;
        poster = _poster;
        trailer = _trailer;
        
        balances[filmmaker] = totalSupply_;
        allowed[filmmaker][boxOffice] = totalSupply_;
    }
    
    function updateFilm(
        uint _salesEndDate,
        uint _availableTickets,
        uint _price,
        string _movieName,
        string _ticketSymbol,
        string _logline,
        string _poster,
        string _trailer
    ) 
        public 
        onlyFilmmaker
        returns (bool)
    {
        if (_salesEndDate > now) salesEndDate = _salesEndDate;
        if (_availableTickets <= totalSupply_) availableTickets = _availableTickets;
        if (_price > 0) price = _price;
        if (bytes(_movieName).length > 0) name = _movieName;
        if (bytes(_ticketSymbol).length > 0) symbol = _ticketSymbol;
        if (bytes(_logline).length > 0) logline = _logline;
        if (bytes(_poster).length > 0) poster = _poster;
        if (bytes(_trailer).length > 0) trailer = _trailer;
        
        emit FilmUpdated(
            salesEndDate,
            availableTickets,
            price,
            name,
            symbol,
            logline,
            poster,
            trailer    
        );
        return true;
    } 
    
    function spendTicket() 
        public 
        onlyTicketHolder 
        returns (bool)
    {
        require(balances[msg.sender] >= 1);
        balances[msg.sender] = balances[msg.sender].sub(1);
        balances[boxOffice] = balances[boxOffice].add(1);
        audienceMembers.push(msg.sender);

        emit TicketSpent(msg.sender);
        emit Transfer(msg.sender, boxOffice, 1);
        return true;
    }
    
    function buyTickets(address buyer, uint quantity) external onlyBoxOffice returns (bool) {
        require(balances[filmmaker] >= quantity);
        balances[filmmaker] = balances[filmmaker].sub(quantity);
        balances[buyer] = balances[buyer].add(quantity);
        
        availableTickets = availableTickets.sub(quantity);
        sales = sales.add(quantity.mul(price));
        fund = fund.add(quantity.mul(price));
        
        emit Transfer(filmmaker, buyer, quantity);
        return true;
    }
    
    function withdrawFund(uint amount) external onlyBoxOffice returns (bool) {
        require(fund >= amount);
        fund = fund.sub(amount);
        return true;
    }
    
    function getFilmSummary() public view returns (
        address _filmmaker,
        uint _createdTime,
        uint _salesEndDate,
        uint _availableTickets,
        uint _price,
        string _movieName,
        string _ticketSymbol,
        string _logline,
        string _poster,
        string _trailer
    ) {
        _filmmaker = filmmaker;
        _createdTime = createdTime;
        _salesEndDate = salesEndDate;
        _availableTickets = availableTickets;
        _price = price;
        _movieName = name;
        _ticketSymbol = symbol;
        _logline = logline;
        _poster = poster;
        _trailer = trailer;
    }
    
    function getFilmStats() public view returns (uint, uint, uint, uint, uint) {
        return (sales, fund, balanceOf(boxOffice), balanceOf(filmmaker), totalSupply_);
    }
    
    function getAudienceMembers() public view returns (address[]) {
        return audienceMembers;
    }

}