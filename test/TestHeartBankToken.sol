pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/HeartBankToken.sol";

contract TestHeartBankToken {

    function testTokenDetails() public {
        HeartBankToken token = HeartBankToken(DeployedAddresses.HeartBankToken());
        Assert.equal(token.name(), "HeartBank", "should store token name");
        Assert.equal(token.symbol(), "Kiitos", "should store token symbol");
        Assert.equal(token.totalSupply(), 1 ether, "should store token supply");
    }

    function testBalanceOf() public {
        HeartBankToken token = HeartBankToken(DeployedAddresses.HeartBankToken());
        Assert.equal(token.balanceOf(msg.sender), 1 ether, "should return balance");
    }

    function testAllowance() public {
        HeartBankToken token = HeartBankToken(DeployedAddresses.HeartBankToken());
        Assert.isTrue(token.approve(address(0), 1 finney), "should approve spender");
        Assert.equal(token.allowance(address(this), address(0)), 1 finney, "should approve allowance");
    }

    function testTransfer() public {
        HeartBankToken token = new HeartBankToken();
        Assert.isTrue(token.transfer(address(1), 1 finney), "should transfer to recipient");
        Assert.equal(token.balanceOf(address(1)), 1 finney, "should transfer amount");
    }

    function testTransferFrom() public {
        HeartBankToken token = new HeartBankToken();
        Assert.isTrue(token.transferFrom(address(1), address(2), 0 wei), "should transfer on behalf");
    }

    function testTransferToAdmin() public {
        HeartBankToken token = new HeartBankToken();
        Assert.isTrue(token.addAdmin(address(this)), "should add new admin");
        Assert.isTrue(token.transferToAdmin(address(this), 1 finney), "should transfer to admin");
    }

}
