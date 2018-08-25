pragma solidity ^0.4.24;

import {BoxOfficeOracleStorage as Storage} from "./BoxOfficeOracleStorage.sol";

library BoxOfficeOracleLibrary {
    
    function usdPriceOfEth(address oracle) public view returns (uint) {
        return Storage(oracle).usdPriceOfEth();
    }
    
    function usdPriceOfEth(address oracle, uint price) public returns (bool) {
        return Storage(oracle).usdPriceOfEth(price);
    }
    
}