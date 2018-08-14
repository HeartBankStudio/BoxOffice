pragma solidity ^0.4.24;

interface BoxOfficeMovieInterface {
    
    function updateMovieName(string movieName) external returns (bool);
    
    function updateTicketSymbol(string ticketSymbol) external returns (bool);
    
    function transferToBoxOffice(address holder, uint tickets) external returns (bool);

    function transfer(address _to, uint256 _value) external returns (bool);

    function approve(address _spender, uint256 _value) external returns (bool);

    function transferFrom(address _from, address _to, uint256 _value) external returns (bool);
    
    function name() external view returns (string);
    
    function symbol() external view returns (string);
    
    function totalSupply() external view returns (uint256);
    
    function balanceOf(address _who) external view returns (uint256);
    
    function allowance(address _owner, address _spender) external view returns (uint256);

}
