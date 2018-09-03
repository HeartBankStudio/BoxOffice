pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol";

/** @title A Box Office Movie that inherits ERC20 */
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

    /** @dev Instantiates a ERC20 token per movie 
     * @param _filmmaker Address of filmmaker 
     * @param _salesEndDate End date of ticket sales
     * @param _availableTickets Quantity of tickets available during sales period
     * @param _price Price of each ticket
     * @param _ticketSupply Total supply of tickets 
     * @param _movieName Title of movie
     * @param _ticketSymbol Token symbol of ticket
     * @param _logline Logline of movie
     * @param _poster IPFS hash of movie poster
     * @param _trailer YouTube id of video trailer
     */
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
    
    /** @dev Updates movie and token details
     * @param _salesEndDate End date of ticket sales
     * @param _availableTickets Quantity of tickets available during sales period
     * @param _price Price of each ticket
     * @param _movieName Title of movie
     * @param _ticketSymbol Token symbol of ticket
     * @param _logline Logline of movie
     * @param _poster IPFS hash of movie poster
     * @param _trailer YouTube id of video trailer
     * @return Boolean for testing in solidity
     */
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
    
    /** @dev Spends a movie ticket 
     * @return Boolean for testing in solidity
     */
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
    
    /** @dev Purchases movie tickets
     * @param buyer Address of buyer
     * @param quantity Number of tikcets to purchase
     * @return Boolean for testing in solidity 
     */
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
    
    /** @dev Withdraws from fund to pay expense
     * @param amount Amount in wei to pay
     * @return Boolean for testing in solidity
     */
    function withdrawFund(uint amount) external onlyBoxOffice returns (bool) {
        require(fund >= amount);
        fund = fund.sub(amount);
        return true;
    }
    
    /** @dev Retrieves movie and token details 
     * @return _filmmaker Address of filmmaker 
     * @return _salesEndDate End date of ticket sales
     * @return _availableTickets Quantity of tickets available during sales period
     * @return _price Price of each ticket
     * @return _movieName Title of movie
     * @return _ticketSymbol Token symbol of ticket
     * @return _logline Logline of movie
     * @return _poster IPFS hash of movie poster
     * @return _trailer YouTube id of video trailer
     */
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
    
    /** @dev Retrieves movie statistics 
     * @return Total ticket sales
     * @return Balance from ticket sales and withdrawals
     * @return Total tickets spent
     * @return Total tickets available 
     * @return Total supply of tickets  
     */
    function getFilmStats() public view returns (uint, uint, uint, uint, uint) {
        return (sales, fund, balanceOf(boxOffice), balanceOf(filmmaker), totalSupply_);
    }
    
    /** @dev Retrieves audience members 
     * @return Addresses of audience members
     */
    function getAudienceMembers() public view returns (address[]) {
        return audienceMembers;
    }

}