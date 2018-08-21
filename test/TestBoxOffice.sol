pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/HeartBankToken.sol";
import "../contracts/BoxOffice.sol";

contract TestBoxOffice {

    uint public initialBalance = 1 ether;
    BoxOffice boxOffice;

    function testInitialState() public {
        boxOffice = BoxOffice(DeployedAddresses.BoxOffice());

        Assert.equal(boxOffice.admin(), msg.sender, "should store admin");
        Assert.equal(boxOffice.kiitos(), DeployedAddresses.HeartBankToken(), "should store Kiitos address");
        Assert.equal(boxOffice.heartbank(), 0, "should store HeartBank's balance");
        Assert.equal(boxOffice.listingFee(), 2, "should store listing fee");
        Assert.equal(boxOffice.withdrawFee(), 1, "should store withdraw fee");
    }

    function testFallBack() public {
        boxOffice = BoxOffice(DeployedAddresses.BoxOffice());

        Assert.equal(address(this).balance, initialBalance, "should receive ether");
        Assert.isTrue(address(boxOffice).call.value(1 finney)(0x0), "should trigger callback");
    }

    function testUpdateFees() public {
        HeartBankToken kiitos = new HeartBankToken();
        boxOffice = new BoxOffice(address(kiitos));

        Assert.isTrue(boxOffice.updateFees(3, 2), "should update fees");
    }

    function testWithdrawBoxOffice() public {
        HeartBankToken kiitos = new HeartBankToken();
        boxOffice = new BoxOffice(address(kiitos));

        Assert.isTrue(address(boxOffice).call.value(1 finney)(0x0), "should trigger callback");
        Assert.isTrue(boxOffice.withdrawBoxOffice(msg.sender, 1 finney, "return excess payment"), "should return excess payment");
    }

    function testShutDownBoxOffice() public {
        HeartBankToken kiitos = new HeartBankToken();
        boxOffice = new BoxOffice(address(kiitos));
        
        Assert.isTrue(boxOffice.toggleEmergency(), "should toggle emergency state");
        Assert.isTrue(address(boxOffice).call(bytes4(keccak256("shutDownBoxOffice()"))), "should self-destruct");
    }

}