pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "../contracts/HeartBankCoin.sol";
import "../contracts/BoxOffice.sol";

contract TestBoxOfficeFilm {

    uint public initialBalance = 1 ether;
    BoxOffice boxOffice;
    address film;

    function beforeEach() public {
        HeartBankCoin kiitos = new HeartBankCoin();
        boxOffice = new BoxOffice(address(kiitos));
        Assert.isTrue(kiitos.addAdmin(address(boxOffice)), "should add admin");
        Assert.isTrue(boxOffice.makeFilm(now + 28 days, 1 szabo, 1 finney, 1 ether, "title", "symbol", "logline", "ipfshash", "youtubeid"), "should make film");
        film = boxOffice.films(0);
    }

    function testBuyTickets() public {
        Assert.isTrue(boxOffice.buyTickets.value(3 finney)(film, 2), "should purchase tickets");
    }

    function testWithdrawFund() public {
        Assert.isTrue(boxOffice.buyTickets.value(3 finney)(film, 2), "should purchase tickets");
        Assert.isTrue(boxOffice.withdrawFund(film, msg.sender, 1 finney, "to pay screenwriter"), "should withdraw from fund");
    }

    function testDonateToCharity() public {
        Assert.isTrue(boxOffice.buyTickets.value(3 finney)(film, 2), "should purchase tickets");
        Assert.isTrue(boxOffice.withdrawFund(film, msg.sender, 1 finney, "to pay screenwriter"), "should withdraw from fund");
        Assert.isTrue(boxOffice.donateToCharity(msg.sender, 1 wei), "should donate to charity");
    }

}
