pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/BoxOfficeRegistry.sol";
// import "../contracts/ThrowProxy.sol";

contract TestBoxOfficeRegistry {

    function testOwner() public {
        BoxOfficeRegistry registry = BoxOfficeRegistry(DeployedAddresses.BoxOfficeRegistry());
        Assert.equal(registry.owner(), msg.sender, "should return address of owner");
    }

    function testUpgradeOracle() public {
        BoxOfficeRegistry registry = new BoxOfficeRegistry(address(0));
        Assert.isTrue(registry.upgradeOracle(address(1)), "should update registry");
        Assert.equal(registry.currentOracle(), address(1), "should store new address");
        Assert.equal(registry.previousOracles(0), address(0), "should store old address");
        Assert.isFalse(registry.upgradeOracle(address(1)), "should not store duplicate address");
    }

    function testUpgradeOracleForFailure() public {
        BoxOfficeRegistry registry = new BoxOfficeRegistry(address(0));
        // ThrowProxy throwProxy = new ThrowProxy(address(registry));
        // BoxOfficeRegistry(address(throwProxy)).upgradeOracle(address(1));
        // Assert.isFalse(throwProxy.execute(), "should throw because not owner");
        Assert.isFalse(address(registry).call("upgradeOracle", address(1)), "should throw because not owner");
    }

    function testKill() public {
        BoxOfficeRegistry registry = new BoxOfficeRegistry(address(0));
        Assert.isFalse(address(registry).call("kill"), "should self-destruct and throw");
    }

}
