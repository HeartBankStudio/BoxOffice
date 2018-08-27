pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/HeartBankCoin.sol";

contract TestHeartBankCoin {

    function testCoinDetails() public {
        HeartBankCoin kiitos = HeartBankCoin(DeployedAddresses.HeartBankCoin());
        Assert.equal(kiitos.name(), "HeartBank", "should store coin name");
        Assert.equal(kiitos.symbol(), "Kiitos", "should store coin symbol");
        Assert.equal(kiitos.totalSupply(), 1 ether, "should store coin supply");
    }

    function testBalanceOf() public {
        HeartBankCoin kiitos = HeartBankCoin(DeployedAddresses.HeartBankCoin());
        Assert.equal(kiitos.balanceOf(msg.sender), 1 ether, "should return balance");
    }

    function testAllowance() public {
        HeartBankCoin kiitos = HeartBankCoin(DeployedAddresses.HeartBankCoin());
        Assert.isTrue(kiitos.approve(address(0), 1 finney), "should approve spender");
        Assert.equal(kiitos.allowance(address(this), address(0)), 1 finney, "should approve allowance");
    }

    function testTransfer() public {
        HeartBankCoin kiitos = new HeartBankCoin();
        Assert.isTrue(kiitos.transfer(address(1), 1 finney), "should transfer to recipient");
        Assert.equal(kiitos.balanceOf(address(1)), 1 finney, "should transfer amount");
    }

    function testTransferFrom() public {
        HeartBankCoin kiitos = new HeartBankCoin();
        Assert.isTrue(kiitos.transferFrom(address(1), address(2), 0 wei), "should transfer on behalf");
    }

    function testToggleAirDrop() public {
        HeartBankCoin kiitos = new HeartBankCoin();
        Assert.isTrue(kiitos.toggleAirDrop(), "should toggle state of airdrop");
    }

    function testAirDrop() public {
        HeartBankCoin kiitos = HeartBankCoin(DeployedAddresses.HeartBankCoin());
        Assert.isTrue(kiitos.airDrop(), "should give 100 kiitos to sender");
    }

    function testTransferToAdmin() public {
        HeartBankCoin kiitos = new HeartBankCoin();
        Assert.isTrue(kiitos.addAdmin(address(this)), "should add new admin");
        Assert.isTrue(kiitos.transferToAdmin(address(this), 1 finney), "should transfer to admin");
    }

}
