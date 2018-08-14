pragma solidity ^0.4.24;

// Proxy contract for testing throws
contract ThrowProxy {
  address public target;
  bytes data;

  constructor(address _target) {
    target = _target;
  }

  //prime the data using the fallback function.
  function() {
    data = msg.data;
  }

  function execute() returns (bool) {
    return target.call(data);
  }
}