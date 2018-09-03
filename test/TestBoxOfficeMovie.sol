pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "../contracts/BoxOfficeMovie.sol";

contract TestBoxOfficeMovie {

    BoxOfficeMovie movie;

    function beforeEach() public {
        movie = new BoxOfficeMovie(address(this), now + 28 days, 1 szabo, 1 finney, 1 ether, "title", "symbol", "logline", "ipfshash", "youtubeid");
    }

    function testMovieDetails() public {
        Assert.equal(movie.name(), "title", "should store movie name");
        Assert.equal(movie.symbol(), "symbol", "should store ticket symbol");
        Assert.equal(movie.totalSupply(), 1 ether, "should store ticket supply");

        Assert.equal(movie.boxOffice(), address(this), "should store box office address");
        Assert.equal(movie.filmmaker(), address(this), "should store filmmaker address");

        // Assert.equal(movie.createdTime(), now, "should store date of creation");
        // Assert.equal(movie.salesEndDate(), now + 28 days, "should store sales end time");
        Assert.equal(movie.availableTickets(), 1 szabo, "should store available tickets");
        Assert.equal(movie.price(), 1 finney, "should store price");
        Assert.equal(movie.sales(), 0, "should store sales");
        Assert.equal(movie.fund(), 0, "should store fund balance");
        Assert.equal(movie.logline(), "logline", "should store logline");
        Assert.equal(movie.poster(), "ipfshash", "should store poster");
        Assert.equal(movie.trailer(), "youtubeid", "should store trailer");

        Assert.equal(movie.balanceOf(address(this)), 1 ether, "should store filmmaker's balance");
        Assert.equal(movie.allowance(address(this), address(this)), 1 ether, "should approve box office's allowance");
    }

    function testUpdateFilm() public {
        Assert.isTrue(movie.updateFilm(now + 30 days, 2 szabo, 2 finney, "title2", "symbol2", "logline2", "ipfshash2", "youtubeid2"), "should update film");

        // Assert.equal(movie.salesEndDate(), now + 30 days, "should update sales end time");
        Assert.equal(movie.availableTickets(), 2 szabo, "should update available tickets");
        Assert.equal(movie.price(), 2 finney, "should update price");
        Assert.equal(movie.name(), "title2", "should update movie name");
        Assert.equal(movie.symbol(), "symbol2", "should update ticket symbol");
        Assert.equal(movie.logline(), "logline2", "should update logline");
        Assert.equal(movie.poster(), "ipfshash2", "should update poster");
        Assert.equal(movie.trailer(), "youtubeid2", "should update trailer");
    }

    function testSpendTicket() public {
        Assert.isTrue(movie.buyTickets(address(this), 2), "should purchase tickets");
        Assert.equal(movie.balanceOf(address(this)), 1 ether, "should update filmmaker's and buyer's balance");
        Assert.equal(movie.availableTickets(), 1 szabo - 2, "should update available tickets");
        Assert.equal(movie.sales(), 2 * 1 finney, "should update sales");
        Assert.equal(movie.fund(), 2 * 1 finney, "should update fund");

        Assert.isTrue(movie.spendTicket(), "should spend ticket");
        Assert.equal(movie.balanceOf(address(this)), 1 ether, "should update box office's and holder's balance");
        Assert.equal(movie.audienceMembers(0), address(this), "should add new audience member");
        Assert.equal(movie.getAudienceMembers()[0], address(this), "should get audience members");
    }

    function testWithdrawFund() public {
        Assert.isTrue(movie.buyTickets(address(this), 2), "should purchase tickets");
        Assert.isTrue(movie.withdrawFund(1 finney), "should withdraw from fund");
        Assert.equal(movie.fund(), 1 finney, "should update fund balance");
    }

   /* function testGetFilmSummary() public {
        address filmmaker;
        uint createdtime;
        uint salesEndDate;
        uint availableTickets;
        uint price;
        string memory movieName;
        string memory ticketSymbol;
        string memory logline;
        string memory poster;
        string memory trailer;
        
        (filmmaker, createdTime, salesEndDate, availableTickets, price, movieName, ticketSymbol, logline, poster, trailer) = movie.getFilmSummary(); 
        
        Assert.equal(filmmaker, address(this), "should return filmmaker");
        Assert.isBelow(salesEndDate, now + 28 days, "should return sales end date");
    } 

    function testGetFilmStats() public {
        uint sales;
        uint fund;
        uint ticketsSold;
        uint availableSupply;
        uint ticketSupply;

        (sales, fund, ticketsSold, availableSupply, ticketSupply) = movie.getFilmStats();

        Assert.equal(sales, 0, "should return ticket sales");
    } */

}
