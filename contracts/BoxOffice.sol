pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import {HeartBankTokenInterface as Kiitos} from "./HeartBankTokenInterface.sol";
import {BoxOfficeOracleInterface as Oracle} from "./BoxOfficeOracleInterface.sol";
import {BoxOfficeMovie as Movie} from "./BoxOfficeMovie.sol";

contract BoxOffice {
    
    using SafeMath for uint;
    
    address public constant HEARTBANK = 0x0;
    address public admin;
    bool private emergency;
    
    Oracle public oracle;
    Kiitos public kiitos;
    
    uint public listingFee;
    uint public withdrawFee;
    
    Film[] public films;
    
    struct Film {
        address filmmaker;
        address movie;
        string logline; 
        string poster; 
        string trailer;
        uint createdTime;
        uint salesEndTime;
        uint price;
        uint sales;
        uint fund;
        mapping (uint => Withdrawal) withdrawals;
        uint withdraws;
        mapping (address => bool) audience;
        address[] members;
    }
    
    struct Withdrawal {
        address recipient;
        uint amount;
        string expense;
    }
    
    event FilmCreated(
        uint indexed filmIndex,
        uint salesEndTime,
        uint price,
        uint ticketSupply, 
        string movieName, 
        string ticketSymbol,
        string logline,
        string poster,
        string trailer
    );
    
    event FilmUpdated(
        uint indexed filmIndex,
        uint salesEndTime,
        uint price,
        string movieName,
        string ticketSymbol,
        string logline,
        string poster,
        string trailer
    );
    
    event TicketsBought(
        uint indexed filmIndex, 
        address indexed buyer, 
        uint quantity
    );
    
    event ExcessPayment(
        uint indexed filmIndex,
        address indexed buyer,
        uint excess
    );
    
    event TicketSpent(
        uint indexed filmIndex, 
        address indexed holder
    );
    
    event FundWithdrawn(
        uint indexed filmIndex, 
        address indexed recipient, 
        uint amount, 
        string expense
    );
    
    event FeeUpdated(
        uint listingFee,
        uint withdrawFee
    );
    
    event FallbackTriggered(
        address indexed sender,
        uint value
    );
    
    modifier onlyAdmin {
        require(msg.sender == admin);
        _;
    }
    
    modifier onlyFilmmaker(uint filmIndex) {
        require(msg.sender == films[filmIndex].filmmaker);
        _;
    }
    
    modifier onlyTicketHolder(uint filmIndex) {
        require(Movie(films[filmIndex].movie).balanceOf(msg.sender) > 0);
        _;
    }
    
    modifier onlyDuringSalesPeriod(uint filmIndex) {
        require(now < films[filmIndex].salesEndTime);
        _;
    }
    
    modifier checkPaymentAmount(uint filmIndex, uint quantity) {
        require(quantity > 0);
        require(msg.value >= quantity.mul(films[filmIndex].price));
        _;
    }
    
    modifier checkExcessPayment(uint filmIndex, uint quantity) {
        _;
        uint excess = msg.value.sub(quantity.mul(films[filmIndex].price));
        // if (excess > 0) msg.sender.transfer(excess);
        if (excess > 0) emit ExcessPayment(filmIndex, msg.sender, excess);
    }
    
    modifier chargeListingFee {
        require(kiitos.balanceOf(msg.sender) >= listingFee);
        kiitos.transferToAdmin(msg.sender, listingFee);
        _;
    }
    
    modifier chargeWithdrawFee(uint amount) {
        _;
        HEARTBANK.transfer(withdrawFee.div(100).mul(amount));
    }
    
    modifier stopInEmergency { 
        require(!emergency); 
        _; 
    }
    
    modifier onlyInEmergency { 
        require(emergency); 
        _;
    }
    
    constructor(address _token, address _oracle) public {
        admin = msg.sender;
        emergency = false;
        
        kiitos = Kiitos(_token);
        oracle = Oracle(_oracle);
        
        listingFee = 2;
        withdrawFee = 1;
    }
    
    function() public payable {
        // if (msg.value > 0) msg.sender.transfer(msg.value);
        emit FallbackTriggered(msg.sender, msg.value);
    }
    
    function makeFilm(
        uint salesEndTime,
        uint price,
        uint ticketSupply, 
        string movieName, 
        string ticketSymbol,
        string logline,
        string poster,
        string trailer
    ) 
        public 
        stopInEmergency
        chargeListingFee
        returns (bool)
    {
        require(salesEndTime > now);
        require(price > 0);
        require(ticketSupply > 0);
        require(bytes(movieName).length > 0);
        require(bytes(ticketSymbol).length > 0);
        require(bytes(logline).length > 0);
        require(bytes(poster).length > 0);
        require(bytes(trailer).length > 0);
        
        Film memory film;
        film.filmmaker = msg.sender;
        film.movie = new Movie(film.filmmaker, ticketSupply, movieName, ticketSymbol);
        film.logline = logline;
        film.poster = poster;
        film.trailer = trailer;
        film.createdTime = now;
        film.salesEndTime = salesEndTime;
        film.price = price;
        film.sales = 0;
        film.fund = 0;
        film.withdraws = 0;
        films.push(film);
        
        emit FilmCreated(
            films.length - 1,
            salesEndTime,
            price,
            ticketSupply,
            movieName,
            ticketSymbol,
            logline,
            poster,
            trailer    
        );
        return true;
    }
    
    function updateFilm(
        uint filmIndex,
        uint salesEndTime,
        uint price,
        string movieName,
        string ticketSymbol,
        string logline,
        string poster,
        string trailer
    ) 
        public 
        stopInEmergency
        onlyFilmmaker(filmIndex) 
        returns (bool)
    {
        Film storage film = films[filmIndex];
        Movie movie = Movie(film.movie);
        
        if (salesEndTime > now) film.salesEndTime = salesEndTime;
        if (price > 0) film.price = price;
        if (bytes(movieName).length > 0) movie.updateMovieName(movieName);
        if (bytes(ticketSymbol).length > 0) movie.updateTicketSymbol(ticketSymbol);
        if (bytes(logline).length > 0) film.logline = logline;
        if (bytes(poster).length > 0) film.poster = poster;
        if (bytes(trailer).length > 0) film.trailer = trailer;
        
        emit FilmUpdated(
            filmIndex,
            salesEndTime,
            price,
            movieName,
            ticketSymbol,
            logline,
            poster,
            trailer    
        );
        return true;
    } 
    
    function buyTickets(uint filmIndex, uint quantity) 
        public 
        payable
        stopInEmergency
        onlyDuringSalesPeriod(filmIndex)
        checkPaymentAmount(filmIndex, quantity)
        checkExcessPayment(filmIndex, quantity)
        returns (bool)
    {
        Film storage film = films[filmIndex];
        Movie(film.movie).transferFrom(film.filmmaker, msg.sender, quantity);
        film.sales = film.sales.add(quantity.mul(film.price));
        film.fund = film.fund.add(quantity.mul(film.price));
        
        emit TicketsBought(filmIndex, msg.sender, quantity);
        return true;
    }
    
    function spendTicket(uint filmIndex) 
        public 
        stopInEmergency
        onlyTicketHolder(filmIndex) 
        returns (bool)
    {
        Film storage film = films[filmIndex];
        Movie(film.movie).transferToBoxOffice(msg.sender, 1);
        film.members.push(msg.sender);
        film.audience[msg.sender] = true;
        
        emit TicketSpent(filmIndex, msg.sender);
        return true;
    }
    
    function withdrawFund(uint filmIndex, address recipient, uint amount, string expense) 
        public 
        stopInEmergency
        onlyFilmmaker(filmIndex)
        chargeWithdrawFee(amount)
        returns (bool)
    {
        Film storage film = films[filmIndex];
        require(recipient != address(0));
        require(amount > 0);
        uint total = amount.add(withdrawFee.div(100).mul(amount));
        require(film.fund >= total);
        require(bytes(expense).length > 0);
        
        film.withdrawals[film.withdraws] = Withdrawal(recipient, amount, expense);
        film.withdraws = film.withdraws.add(1);
        film.fund = film.fund.sub(total);
        recipient.transfer(amount);
        
        emit FundWithdrawn(filmIndex, recipient, amount, expense);
        return true;
    }
    
    function updateFee(uint _listingFee, uint _withdrawFee)
        public
        stopInEmergency
        onlyAdmin
        returns (bool)
    {
        listingFee = _listingFee;
        withdrawFee = _withdrawFee;
        emit FeeUpdated(listingFee, withdrawFee);
        return true;
    }
    
    function getBoxOfficeStats() public view returns (
        uint totalReceipts,
        uint totalFilms
    ) {
        totalReceipts = getTotalReceipts();
        totalFilms = getTotalFilms();
    }
     
    function getTotalReceipts() public view returns (uint) {
        return convertToUsd(address(this).balance);
    }
    
    function getTotalFilms() public view returns (uint) {
        return films.length;
    }
    
    function getFilmSummary(uint index) public view returns (
        address movie,
        address filmmaker,
        uint salesEndTime,
        uint price,
        uint ticketSupply,
        string movieName,
        string ticketSymbol,
        string logline,
        string poster,
        string trailer
    ) {
        Film storage film = films[index];
        Movie movie_ = Movie(film.movie);
        movie = film.movie;
        filmmaker = film.filmmaker;
        salesEndTime = film.salesEndTime;
        price = film.price;
        ticketSupply = movie_.totalSupply();
        movieName = movie_.name();
        ticketSymbol = movie_.symbol();
        logline = film.logline;
        poster = film.poster;
        trailer = film.trailer;
    }
    
    function getFilmStats(uint index) public view returns (
        uint price,
        uint audience,
        uint withdraws,
        uint ticketSupply,
        uint ticketsAvailable,
        uint ticketsSold,
        uint filmMarketValue,
        uint fundsCollected,
        uint fundsWithdrawn,
        uint fundBalance
    ) {
        price = getTicketPrice(index);
        audience = getAudienceMembers(index).length;
        withdraws = getTotalWithdraws(index);
        ticketSupply = getTicketSupply(index);
        ticketsAvailable = getTicketsAvailable(index);
        ticketsSold = getTicketsSold(index);
        filmMarketValue = getMarketValue(index);
        fundsCollected = getFundsCollected(index);
        fundsWithdrawn = getFundsWithdrawn(index);
        fundBalance = getFundBalance(index);
    }
    
    function getTicketSupply(uint filmIndex) public view returns (uint) {
        return Movie(films[filmIndex].movie).totalSupply();
    }
    
    function getTicketsAvailable(uint filmIndex) public view returns (uint) {
        Film storage film = films[filmIndex];
        return Movie(film.movie).balanceOf(film.filmmaker);
    }
    
    function getTicketsSold(uint filmIndex) public view returns (uint) {
        return getTicketSupply(filmIndex).sub(getTicketsAvailable(filmIndex));
    }
    
    function getTicketPrice(uint filmIndex) public view returns (uint) {
        return convertToUsd(films[filmIndex].price);
    }
    
    function getMarketValue(uint filmIndex) public view returns (uint) {
        return convertToUsd(films[filmIndex].price.mul(getTicketSupply(filmIndex)));
    }
    
    function getFundsCollected(uint filmIndex) public view returns (uint) {
        return convertToUsd(films[filmIndex].sales);
    }
    
    function getFundsWithdrawn(uint filmIndex) public view returns (uint) {
        Film storage film = films[filmIndex];
        return convertToUsd(film.sales.sub(film.fund));
    }
    
    function getFundBalance(uint filmIndex) public view returns (uint) {
        return convertToUsd(films[filmIndex].fund);
    }
    
    function getTotalWithdraws(uint filmIndex) public view returns (uint) {
        return films[filmIndex].withdraws;
    }
    
    function getWithdrawal(uint filmIndex, uint withdrawIndex) public view returns (address, uint, string) {
        Withdrawal storage withdrawal = films[filmIndex].withdrawals[withdrawIndex];
        return (withdrawal.recipient, withdrawal.amount, withdrawal.expense);
    }
    
    function getAudienceMembers(uint filmIndex) public view returns (address[]) {
        return films[filmIndex].members;
    }
    
    function isAudienceMember(uint filmIndex, address member) public view returns (bool) {
        return films[filmIndex].audience[member];
    }
    
    function convertToUsd(uint amountInWei) public view returns (uint) {
        return oracle.convertToUsd(amountInWei);
    }
    
    function returnExcessPayment(address recipient, uint amount) public onlyAdmin returns (bool) {
        recipient.transfer(amount);
        return true;
    }
    
    function toggleEmergency() public onlyAdmin returns (bool) {
        emergency = !emergency;
        return true;
    }
    
    function shutDownBoxOffice() public onlyInEmergency onlyAdmin {
        selfdestruct(admin);
    }
    
}
