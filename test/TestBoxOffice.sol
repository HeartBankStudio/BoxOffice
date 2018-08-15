pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/HeartBankToken.sol";
import "../contracts/BoxOffice.sol";

contract TestBoxOffice0 {

    uint public initialBalance = 1 ether;
    BoxOffice boxOffice;

    function beforeEach() public {
        boxOffice = BoxOffice(DeployedAddresses.BoxOffice());
    }

    function testInitialState() public {
        Assert.equal(boxOffice.HEARTBANK(), address(0), "should store HeartBank address");
        // Assert.equal(boxOffice.kiitos(), DeployedAddresses.BoxOfficeOracle(), "should store Kiitos address");
        Assert.equal(boxOffice.admin(), msg.sender, "should store admin");
        Assert.equal(boxOffice.listingFee(), 2, "should store listing fee");
        Assert.equal(boxOffice.withdrawFee(), 1, "should store withdraw fee");
    }

    function testFallBack() public {
        Assert.equal(address(this).balance, initialBalance, "should receive ether");
        Assert.isTrue(address(boxOffice).call.value(1 finney)(0x0), "should trigger callback");
        // Assert.equal(address(this).balance, initialBalance, "should return finney");
    }

}

contract TestBoxOffice {

    BoxOffice boxOffice;
    uint public initialBalance = 1 ether;

    function beforeEach() public {
        HeartBankToken kiitos = new HeartBankToken();
        boxOffice = new BoxOffice(address(kiitos), DeployedAddresses.BoxOfficeOracle());
        Assert.isTrue(kiitos.addAdmin(address(boxOffice)), "should add admin");
        Assert.isTrue(boxOffice.makeFilm(now + 28 days, 1 finney, 1 ether, "title", "symbol", "logline", "ipfshash", "ipfshash"), "should make film");
    }

    function testUpdateFilm() public {
        Assert.isTrue(boxOffice.updateFilm(0, now + 30 days, 2 finney, "title2", "symbol2", "logline2", "ipfshash2", "ipfshash2"), "should update film");
    }

    function testBuyTickets() public {
        Assert.isTrue(boxOffice.buyTickets.value(3 finney)(0, 2), "should purchase tickets");
    }

    function testSpendTicket() public {
        Assert.isTrue(boxOffice.buyTickets.value(3 finney)(0, 2), "should purchase tickets");
        Assert.isTrue(boxOffice.spendTicket(0), "should spend ticket");
    }

    function testWithdrawFund() public {
        Assert.isTrue(boxOffice.buyTickets.value(3 finney)(0, 2), "should purchase tickets");
        Assert.isTrue(boxOffice.withdrawFund(0, msg.sender, 1 finney, "to pay screenwriter"), "should withdraw from fund");
    }

    function testUpdateFees() public {
        Assert.isTrue(boxOffice.updateFees(3, 2), "should update fees");
    }

    function testReturnExcessPayment() public {
        Assert.isTrue(boxOffice.buyTickets.value(3 finney)(0, 2), "should purchase tickets");
        Assert.isTrue(boxOffice.returnExcessPayment(msg.sender, 1 finney), "should return excess payment");
    }

}

contract TestBoxOffice1 {

    function testMakeFilm1() public {
        HeartBankToken kiitos = new HeartBankToken();
        BoxOffice boxOffice = new BoxOffice(address(kiitos), DeployedAddresses.BoxOfficeOracle());

        uint salesEndTime = now + 28 days;
        uint price = 1 finney;
        uint ticketSupply = 1 ether;
        string memory movieName = "Casablanca";
        string memory ticketSymbol = "CSBC";
        string memory logline = "An American expatriate meets a former lover, with unforeseen complications.";
        string memory poster = "ipfshash";
        string memory trailer = "ipfshash";
        
        Assert.isTrue(kiitos.addAdmin(address(boxOffice)), "should add admin");
        Assert.isTrue(boxOffice.makeFilm(salesEndTime, price, ticketSupply, movieName, ticketSymbol, logline, poster, trailer), "should make film");
        
        address movie;
        address filmmaker;

        (movie, filmmaker, , , , , , , , ) = boxOffice.getFilmSummary(0);

        Assert.isNotZero(movie, "should create movie");
        Assert.equal(filmmaker, address(this), "should store filmmaker");
    }

}

contract TestBoxOffice2 {

    function testMakeFilm2() public {
        HeartBankToken kiitos = new HeartBankToken();
        BoxOffice boxOffice = new BoxOffice(address(kiitos), DeployedAddresses.BoxOfficeOracle());

        uint salesEndTime = now + 28 days;
        uint price = 1 finney;
        uint ticketSupply = 1 ether;
        string memory movieName = "Casablanca";
        string memory ticketSymbol = "CSBC";
        string memory logline = "An American expatriate meets a former lover, with unforeseen complications.";
        string memory poster = "ipfshash";
        string memory trailer = "ipfshash";
        
        Assert.isTrue(kiitos.addAdmin(address(boxOffice)), "should add admin");
        Assert.isTrue(boxOffice.makeFilm(salesEndTime, price, ticketSupply, movieName, ticketSymbol, logline, poster, trailer), "should make film");
        
        uint salesEndTime_;
        uint price_;

        ( , , salesEndTime_, price_, , , , , , ) = boxOffice.getFilmSummary(0);

        Assert.equal(salesEndTime, salesEndTime_, "should store sales ending time");
        Assert.equal(price, price_, "should store price");
    }

}

contract TestBoxOffice3 {

    function testMakeFilm3() public {
        HeartBankToken kiitos = new HeartBankToken();
        BoxOffice boxOffice = new BoxOffice(address(kiitos), DeployedAddresses.BoxOfficeOracle());

        uint salesEndTime = now + 28 days;
        uint price = 1 finney;
        uint ticketSupply = 1 ether;
        string memory movieName = "Casablanca";
        string memory ticketSymbol = "CSBC";
        string memory logline = "An American expatriate meets a former lover, with unforeseen complications.";
        string memory poster = "ipfshash";
        string memory trailer = "ipfshash";
        
        Assert.isTrue(kiitos.addAdmin(address(boxOffice)), "should add admin");
        Assert.isTrue(boxOffice.makeFilm(salesEndTime, price, ticketSupply, movieName, ticketSymbol, logline, poster, trailer), "should make film");
        
        uint ticketSupply_;
        string memory movieName_;
        
        ( , , , , ticketSupply_, movieName_, , , , ) = boxOffice.getFilmSummary(0);

        Assert.equal(ticketSupply, ticketSupply_, "should store ticket supply");
        Assert.equal(movieName, movieName_, "should store movie name");
    }

}

contract TestBoxOffice4 {

    function testMakeFilm4() public {
        HeartBankToken kiitos = new HeartBankToken();
        BoxOffice boxOffice = new BoxOffice(address(kiitos), DeployedAddresses.BoxOfficeOracle());

        uint salesEndTime = now + 28 days;
        uint price = 1 finney;
        uint ticketSupply = 1 ether;
        string memory movieName = "Casablanca";
        string memory ticketSymbol = "CSBC";
        string memory logline = "An American expatriate meets a former lover, with unforeseen complications.";
        string memory poster = "ipfshash";
        string memory trailer = "ipfshash";
        
        Assert.isTrue(kiitos.addAdmin(address(boxOffice)), "should add admin");
        Assert.isTrue(boxOffice.makeFilm(salesEndTime, price, ticketSupply, movieName, ticketSymbol, logline, poster, trailer), "should make film");
        
        string memory ticketSymbol_;
        string memory logline_;
        
        ( , , , , , , ticketSymbol_, logline_, , ) = boxOffice.getFilmSummary(0);

        Assert.equal(ticketSymbol, ticketSymbol_, "should store ticket symbol");
        Assert.equal(logline, logline_, "should store logline");
    }

}

contract TestBoxOffice5 {

    function testMakeFilm5() public {
        HeartBankToken kiitos = new HeartBankToken();
        BoxOffice boxOffice = new BoxOffice(address(kiitos), DeployedAddresses.BoxOfficeOracle());

        uint salesEndTime = now + 28 days;
        uint price = 1 finney;
        uint ticketSupply = 1 ether;
        string memory movieName = "Casablanca";
        string memory ticketSymbol = "CSBC";
        string memory logline = "An American expatriate meets a former lover, with unforeseen complications.";
        string memory poster = "ipfshash";
        string memory trailer = "ipfshash";
        
        Assert.isTrue(kiitos.addAdmin(address(boxOffice)), "should add admin");
        Assert.isTrue(boxOffice.makeFilm(salesEndTime, price, ticketSupply, movieName, ticketSymbol, logline, poster, trailer), "should make film");
        
        string memory poster_;
        string memory trailer_;
        
        ( , , , , , , , , poster_, trailer_) = boxOffice.getFilmSummary(0);

        Assert.equal(poster, poster_, "should store poster");
        Assert.equal(trailer, trailer_, "should store trailer");
    }

}

contract TestBoxOffice6 {

    BoxOffice boxOffice;
    uint public initialBalance = 1 ether;

    function beforeEach() public {
        HeartBankToken kiitos = new HeartBankToken();
        boxOffice = new BoxOffice(address(kiitos), DeployedAddresses.BoxOfficeOracle());
        Assert.isTrue(kiitos.addAdmin(address(boxOffice)), "should add admin");
        Assert.isTrue(boxOffice.makeFilm(now + 28 days, 1 finney, 1 ether, "title", "symbol", "logline", "ipfshash", "ipfshash"), "should make film");
    }

    function testGetAudienceMembers() public {
        Assert.isTrue(boxOffice.buyTickets.value(3 finney)(0, 2), "should purchase tickets");
        Assert.isTrue(boxOffice.spendTicket(0), "should spend ticket");
        address[] memory members = boxOffice.getAudienceMembers(0);
        Assert.equal(members[0], address(this), "should store audience member");
    }

    function testIsAudienceMember() public {
        Assert.isTrue(boxOffice.buyTickets.value(3 finney)(0, 2), "should purchase tickets");
        Assert.isTrue(boxOffice.spendTicket(0), "should spend ticket");
        Assert.isTrue(boxOffice.isAudienceMember(0, address(this)), "should store audience member");
    }

}

contract TestBoxOffice7 {

    BoxOffice boxOffice;
    uint public initialBalance = 1 ether;

    function beforeEach() public {
        HeartBankToken kiitos = new HeartBankToken();
        boxOffice = new BoxOffice(address(kiitos), DeployedAddresses.BoxOfficeOracle());
        Assert.isTrue(kiitos.addAdmin(address(boxOffice)), "should add admin");
        Assert.isTrue(boxOffice.makeFilm(now + 28 days, 1 finney, 1 ether, "title", "symbol", "logline", "ipfshash", "ipfshash"), "should make film");
    }

    function testGetWithdrawal() public {
        address recipient;
        uint amount;
        string memory expense;

        Assert.isTrue(boxOffice.buyTickets.value(3 finney)(0, 2), "should purchase tickets");
        Assert.isTrue(boxOffice.withdrawFund(0, address(this), 1 finney, "to pay screenwriter"), "should purchase tickets");
        (recipient, amount, expense) = boxOffice.getWithdrawal(0, 0);
        Assert.equal(recipient, address(this), "should store recipient");
        Assert.equal(amount, 1 finney, "should store amount");
        Assert.equal(expense, "to pay screenwriter", "should store expense");
    }

    function testGetBoxOfficeStats() public {
        uint totalReceipts;
        uint totalFilms;

        Assert.isTrue(boxOffice.buyTickets.value(3 finney)(0, 2), "should purchase tickets");
        (totalReceipts, totalFilms) = boxOffice.getBoxOfficeStats();
        Assert.equal(totalReceipts, boxOffice.convertToUsd(2 finney), "should return total receipts");
        Assert.equal(totalFilms, 1, "should return total films");
    }

    function testGetFilmStats() public {
        uint price;
        uint audience;
        uint withdraws;
        // uint ticketSupply;
        // uint ticketsAvailable;
        // uint ticketsSold;
        // uint filmMarketValue;
        // uint fundsCollected;
        // uint fundsWithdrawn;
        // uint fundBalance;

        (price, audience, withdraws, , , , , , , ) = boxOffice.getFilmStats(0);
        Assert.equal(audience, 0, "should return total audience members");
    }

    function testShutDownBoxOffice() public {
        Assert.isTrue(boxOffice.toggleEmergency(), "should toggle emergency state");
        Assert.isTrue(address(boxOffice).call(bytes4(keccak256("shutDownBoxOffice()"))), "should self-destruct");
    }

}