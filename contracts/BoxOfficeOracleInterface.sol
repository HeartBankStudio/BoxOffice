pragma solidity ^0.4.24;

interface BoxOfficeOracleInterface {
    function convertToUsd(uint amountInWei) external view returns (uint);
}