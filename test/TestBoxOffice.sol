pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/BoxOffice.sol";

contract TestBoxOffice {

    uint public initialBalance = 1 ether;
    BoxOffice boxOffice;

    function beforeEach() public {
        boxOffice = BoxOffice(DeployedAddresses.BoxOffice());
    }

    function testInitialState() public {
        Assert.equal(boxOffice.HEARTBANK(), msg.sender, "should store HeartBank address");
        Assert.equal(boxOffice.kiitos(), DeployedAddresses.HeartBankToken(), "should store Kiitos address");
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