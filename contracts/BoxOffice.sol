pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import {HeartBankCoinInterface as Kiitos} from "./HeartBankCoinInterface.sol";
import {BoxOfficeMovie as Movie} from "./BoxOfficeMovie.sol";

contract BoxOffice {
    
    using SafeMath for uint;
    using SafeMath for uint8;
    
    address public admin;
    bool private emergency;
    
    Kiitos public kiitos;
    uint public heartbank;
    uint public charity;
    uint public listingFee;
    uint8 public withdrawFee;
    
    address[] public films;
    
    event FilmCreated(
        address movie,
        uint salesEndDate,
        uint availableTickets,
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
        uint price,
        uint quantity
    );
    
    event ExcessPaid(
        uint indexed date,
        address indexed movie,
        address indexed buyer,
        uint excess
    );
    
    event FundWithdrawn(
        uint indexed date,
        address indexed movie, 
        address recipient, 
        uint amount, 
        string expense
    );
    
    event CharityDonated(
        uint indexed date,
        address indexed recipient, 
        uint amount
    );
    
    event ExcessReturned(
        address recipient, 
        uint amount
    );
    
    event FeesUpdated(
        uint listingFee,
        uint withdrawFee
    );
    
    event FallbackTriggered(
        uint indexed date,
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
    
    modifier chargeListingFee {
        require(kiitos.balanceOf(msg.sender) >= listingFee);
        kiitos.transferToAdmin(msg.sender, listingFee);
        _;
    }
    
    modifier chargeWithdrawFee(uint amount) {
        uint fee = withdrawFee.mul(amount).div(100);
        heartbank = heartbank.add(fee);
        charity = charity.add(fee);
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
        charity = 0;
        listingFee = 2;
        withdrawFee = 1;
    }
    
    function() public payable {
        emit FallbackTriggered(now, msg.sender, msg.value);
    }
    
    function makeFilm(
        uint salesEndDate,
        uint availableTickets,
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
        require(salesEndDate > now);
        require(availableTickets <= ticketSupply);
        require(price > 0);
        require(ticketSupply > 0);
        require(bytes(movieName).length > 0);
        require(bytes(ticketSymbol).length > 0);
        require(bytes(logline).length > 0);
        require(bytes(poster).length > 0);
        require(bytes(trailer).length > 0);
        
        Movie film = new Movie(msg.sender, salesEndDate, availableTickets, price, ticketSupply, movieName, ticketSymbol, logline, poster, trailer);
        films.push(film);
        
        emit FilmCreated(
            film,
            salesEndDate,
            availableTickets,
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
        returns (bool)
    {
        require(quantity > 0);
        Movie film = Movie(movie);
        uint price = film.price();
        
        // only during sales period
        require(now < film.salesEndDate());
        
        // check available tickets
        require(quantity <= film.availableTickets());
        
        // check payment amount
        require(msg.value >= quantity.mul(price));
        
        // check excess payment
        uint excess = msg.value.sub(quantity.mul(price));
        if (excess > 0) emit ExcessPaid(now, movie, msg.sender, excess);
        
        film.buyTickets(msg.sender, quantity);
        emit TicketsBought(movie, msg.sender, price, quantity);
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
        Movie(movie).withdrawFund(amount.add(withdrawFee.mul(amount).div(100)));
        
        emit FundWithdrawn(now, movie, recipient, amount, expense);
        recipient.transfer(amount);
        return true;
    }
    
    function getFilms() public view returns (address[]) {
        return films;
    }
    
    function updateFees(uint listing, uint8 withdraw)
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
    
    function donateToCharity(address recipient, uint amount) public onlyAdmin returns (bool) {
        require(amount <= heartbank);
        heartbank = heartbank.sub(amount);
        emit CharityDonated(now, recipient, amount);
        recipient.transfer(amount);
        return true;
    }
    
    function returnExcessPayment(address recipient, uint amount) public onlyAdmin returns (bool) {
        require(amount <= address(this).balance);
        emit ExcessReturned(recipient, amount);
        recipient.transfer(amount);
        return true;
    }
    
    function getBoxOfficeStats() public view returns (uint, uint, uint, uint) {
        return (listingFee, withdrawFee, heartbank, charity);
    }
    
    function toggleEmergency() public onlyAdmin returns (bool) {
        emergency = !emergency;
        return true;
    }
    
    function shutDownBoxOffice() public onlyInEmergency onlyAdmin {
        selfdestruct(admin);
    }
    
}

