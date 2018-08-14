pragma solidity ^0.4.24;

interface HeartBankTokenInterface {
    
    function addAdmin(address admin) external returns (bool);
    
    function transferToAdmin(address holder, uint kiitos) external returns (bool);

    function transfer(address _to, uint256 _value) external returns (bool);

    function approve(address _spender, uint256 _value) external returns (bool);

    function transferFrom(address _from, address _to, uint256 _value) external returns (bool);
    
    function totalSupply() external view returns (uint256);
    
    function balanceOf(address _who) external view returns (uint256);
    
    function allowance(address _owner, address _spender) external view returns (uint256);

}
