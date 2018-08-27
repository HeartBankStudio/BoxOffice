pragma solidity ^0.4.24;

import {OracleStorage as Storage} from "./OracleStorage.sol";

library OracleLibrary {
    
    function usdPriceOfEth(address oracle) public view returns (uint) {
        return Storage(oracle).usdPriceOfEth();
    }
    
    function usdPriceOfEth(address oracle, uint price) public returns (bool) {
        return Storage(oracle).usdPriceOfEth(price);
    }
    
}