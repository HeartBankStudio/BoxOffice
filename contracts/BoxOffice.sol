pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import {HeartBankTokenInterface as Kiitos} from "./HeartBankTokenInterface.sol";
import {BoxOfficeMovie as Movie} from "./BoxOfficeMovie.sol";

contract BoxOffice {
    
    using SafeMath for uint;
    
    address public admin;
    bool private emergency;
    
    Kiitos public kiitos;
    uint public heartbank;
    uint public listingFee;
    uint public withdrawFee;
    
    address[] public films;
    
    event FilmCreated(
        address movie,
        uint salesEndTime,
        uint price,
        uint ticketSupply, 
        string movieName, 
        string ticketSymbol,
        string logline,
        string poster,
        string trailer
    );
    
    event TicketsBought(
        address movie, 
        address buyer, 
        uint quantity
    );
    
    event ExcessPayment(
        address movie,
        address buyer,
        uint excess
    );
    
    event FundWithdrawn(
        address indexed movie, 
        address recipient, 
        uint amount, 
        string expense
    );
    
    event BoxOfficeWithdrawn(
        address indexed recipient, 
        uint amount, 
        string reason
    );
    
    event FeesUpdated(
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
    
    modifier onlyFilmmaker(address movie) {
        require(msg.sender == Movie(movie).filmmaker());
        _;
    }
    
    modifier onlyDuringSalesPeriod(address movie) {
        require(now < Movie(movie).salesEndTime());
        _;
    }
    
    modifier checkPaymentAmount(address movie, uint quantity) {
        require(quantity > 0);
        require(msg.value >= quantity.mul(Movie(movie).price()));
        _;
    }
    
    modifier checkExcessPayment(address movie, uint quantity) {
        _;
        uint excess = msg.value.sub(quantity.mul(Movie(movie).price()));
        if (excess > 0) emit ExcessPayment(movie, msg.sender, excess);
    }
    
    modifier chargeListingFee {
        require(kiitos.balanceOf(msg.sender) >= listingFee);
        kiitos.transferToAdmin(msg.sender, listingFee);
        _;
    }
    
    modifier chargeWithdrawFee(uint amount) {
        heartbank = heartbank.add(withdrawFee.div(100).mul(amount));
        _;
    }
    
    modifier stopInEmergency { 
        require(!emergency); 
        _; 
    }
    
    modifier onlyInEmergency { 
        require(emergency); 
        _;
    }
    
    constructor(address token) public {
        kiitos = Kiitos(token);
        admin = msg.sender;
        emergency = false;
        
        heartbank = 0;
        listingFee = 2;
        withdrawFee = 1;
    }
    
    function() public payable {
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
        
        Movie film = new Movie(msg.sender, salesEndTime, price, ticketSupply, movieName, ticketSymbol, logline, poster, trailer);
        films.push(film);
        
        emit FilmCreated(
            film,
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
    
    function buyTickets(address movie, uint quantity) 
        public 
        payable
        stopInEmergency
        onlyDuringSalesPeriod(movie)
        checkPaymentAmount(movie, quantity)
        checkExcessPayment(movie, quantity)
        returns (bool)
    {
        Movie(movie).buyTickets(msg.sender, quantity);
        emit TicketsBought(movie, msg.sender, quantity);
        return true;
    }
    
    function withdrawFund(address movie, address recipient, uint amount, string expense) 
        public 
        stopInEmergency
        onlyFilmmaker(movie)
        chargeWithdrawFee(amount)
        returns (bool)
    {
        require(recipient != address(0));
        require(amount > 0);
        require(bytes(expense).length > 0);
        Movie(movie).withdrawFund(amount.add(withdrawFee.div(100).mul(amount)));
        
        emit FundWithdrawn(movie, recipient, amount, expense);
        recipient.transfer(amount);
        return true;
    }
    
    function getFilms() public view returns (address[]) {
        return films;
    }
    
    function updateFees(uint listing, uint withdraw)
        public
        stopInEmergency
        onlyAdmin
        returns (bool)
    {
        listingFee = listing;
        withdrawFee = withdraw;
        emit FeesUpdated(listingFee, withdrawFee);
        return true;
    }
    
    function withdrawBoxOffice(address recipient, uint amount, string reason) public onlyAdmin returns (bool) {
        emit BoxOfficeWithdrawn(recipient, amount, reason);
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
