pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import {HeartBankCoinInterface as Kiitos} from "./HeartBankCoinInterface.sol";
import {BoxOfficeMovie as Movie} from "./BoxOfficeMovie.sol";

/** @title Box Office factory that creates ERC20 movie tickets */
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
    
    /** @dev Instantiates a Box Office factory with initial values
     * @param token Contract address of the HeartBank coin called Kiitos
     */
    constructor(address token) public {
        kiitos = Kiitos(token);
        admin = msg.sender;
        emergency = false;
        
        heartbank = 0;
        charity = 0;
        listingFee = 2;
        withdrawFee = 1;
    }
    
    /** @dev Catches payment mistakes for admin to refund */
    function() public payable {
        emit FallbackTriggered(now, msg.sender, msg.value);
    }
    
    /** @dev Creates ERC20 token per movie 
     * @param salesEndDate End date of ticket sales
     * @param availableTickets Quantity of tickets available during sales period
     * @param price Price of each ticket
     * @param ticketSupply Total supply of tickets 
     * @param movieName Title of movie
     * @param ticketSymbol Token symbol of ticket
     * @param logline Logline of movie
     * @param poster IPFS hash of movie poster
     * @param trailer YouTube id of video trailer
     * @return Boolean for testing in solidity
     */
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
    
    /** @dev Purchases movie tickets
     * @param movie Address of movie token
     * @param quantity Number of tikcets to purchase
     * @return Boolean for testing in solidity 
     */
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
    
    /** @dev Withdraws from fund to pay expense
     * @param movie Address of movie token
     * @param recipient Address of recipient to be paid
     * @param amount Amount in wei to pay
     * @param expense Description of expense
     * @return Boolean for testing in solidity
     */
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
    
    /** @dev Returns array of movie token addresses
     * @return Movie token addresses
     */
    function getFilms() public view returns (address[]) {
        return films;
    }
    
    /** @dev Lets admin update listing fee and withdraw fee
     * @param listing Listing fee in Kiitos for creating a movie token
     * @param withdraw Fee as percentage of amount for withdrawing from fund
     * @return Boolean for testing in solidity
     */
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
    
    /** @dev Gives admin the ability to donate widthdraw fees to any charity
     * @param recipient Address of charity
     * @param amount Amount in wei to donate
     * @return Boolean for testing in solidity
     */
    function donateToCharity(address recipient, uint amount) public onlyAdmin returns (bool) {
        require(amount <= heartbank);
        heartbank = heartbank.sub(amount);
        emit CharityDonated(now, recipient, amount);
        recipient.transfer(amount);
        return true;
    }
    
    /** @dev Gives admin the ability to return payment in excess or mistake 
     * @param recipient Address of recipient to refund
     * @param amount Amount in wei to refund 
     * @return Boolean for testing in solidity
     */
    function returnExcessPayment(address recipient, uint amount) public onlyAdmin returns (bool) {
        require(amount <= address(this).balance);
        emit ExcessReturned(recipient, amount);
        recipient.transfer(amount);
        return true;
    }
    
    /** @dev Returns stats collected
     * @return listingFee The listing fee
     * @return withdrawFee The withdraw fee
     * @return heartbank Balance of withdraw fees withdrawn for charity 
     * @return charity Total withdraw fees collected
     */
    function getBoxOfficeStats() public view returns (uint, uint, uint, uint) {
        return (listingFee, withdrawFee, heartbank, charity); 
    }
    
    /** @dev Lets admin toggle the state of emergency 
     * @return Boolean for testing in solidity
     */
    function toggleEmergency() public onlyAdmin returns (bool) {
        emergency = !emergency;
        return true;
    }
    
    /** @dev Lets admin destroy this contract and send excess balance to self
     */
    function shutDownBoxOffice() public onlyInEmergency onlyAdmin {
        selfdestruct(admin);
    }
    
}

