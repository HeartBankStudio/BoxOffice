pragma solidity ^0.4.24;

interface HeartBankTokenInterface {

    function transferToAdmin(address holder, uint kiitos) external returns (bool);
    
    function balanceOf(address _who) external view returns (uint256);
    
}
