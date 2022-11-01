// SPDX-License-Identifier:MIT
pragma solidity >=0.4.22 <0.9.0;
//pragma solidity ^0.5.8;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract CashPoints is ERC20{

    struct CashPoint {
        string _name; //short Name
        int _latitude;
        int _longitude;
        string _phoneNumber;
	    string _currency;
        uint _buy; //local currency to usd buy rate
        uint _sell; //local currency to usd sell rate
        string _endTime; //when time as cashpoint will expire
        bool _isCashPoint;
    }
    
    mapping (address=>CashPoint) public cashpoints;
    mapping(uint=>address) public keys;
    event CreatedCashPoint(address cashpoint);
    event Received(address, uint);
     //add the keyword payable to the state variable
    address payable public Owner;
    uint public constant MAX_SUPPLY = 100000;
    uint public PRICE_PER_TOKEN; //erc20 token price
    uint public CASHPOINT_FEE = 0.5 ether;
    uint public count = 0;
    
    constructor() ERC20("Chikwama", "CHK") {
        Owner = payable(msg.sender);
        _mint(Owner, 10000); 
    }

    
    receive() external payable {
        emit Received(msg.sender, msg.value);
    }

    function setPrice() public
    {
       PRICE_PER_TOKEN = (address(this).balance/totalSupply()) * 1 ether ;
    }

    function mint(uint _amount) external payable
    {   require(address(this).balance > 0, "There is no value in this contract");
        setPrice();
        uint quantity = _amount / PRICE_PER_TOKEN;
        require(totalSupply() + quantity <= MAX_SUPPLY, "Max supply reached");
        _mint(msg.sender, (_amount / PRICE_PER_TOKEN));
    }

    
    function addCashPoint(string memory name, int mylat, int mylong, string memory phone, string memory currency, uint buy, uint sell, string memory endtime, uint duration) external payable {
      uint fee = duration * CASHPOINT_FEE;
      require(msg.value == fee, "Please pay the recommended fee");
      require(!cashpoints[msg.sender]._isCashPoint, "already a cashpoint");
            cashpoints[msg.sender] = CashPoint(name, mylat, mylong, phone, currency, buy, sell, endtime, true);
            count++;
            keys[count]=msg.sender;
            emit CreatedCashPoint(msg.sender);
        
    }

    function updateCashPoint(string memory name, int mylat, int mylong, string memory phone, string memory currency, uint buy, uint sell, string memory endtime) external payable {
      require(cashpoints[msg.sender]._isCashPoint, "not a cashpoint");
            cashpoints[msg.sender] = CashPoint(name, mylat, mylong, phone, currency, buy, sell, endtime, true);
        
    }

    function getCashPoint(address cp) public view returns(CashPoint memory cashpoint)
    {
      return cashpoints[cp];
    }
    

    //create a modifier that the msg.sender must be the owner
    modifier onlyOwner() {
        require(msg.sender == Owner, 'Not owner');
        _;
    }

    modifier onlyHolder() {
        require(balanceOf(msg.sender) > 0, 'Not holder');
        _;
    }
    
    function transferXDai(address payable _to, uint _amount) public {
        (bool success, ) = _to.call{value: _amount}("");
        require(success, "Failed to send xDai");
    }

    function checkIfICanWithdraw(uint256 _amount) public returns (bool)
    {
        setPrice();
        return (balanceOf(msg.sender) * (PRICE_PER_TOKEN )) >= _amount;
    }

    function checkTokensToBurn(uint _amount) public returns (uint256)
    {
        setPrice();
        return (_amount/(totalSupply()*PRICE_PER_TOKEN))*totalSupply();
    }
    

    //holders can withdraw from the contract because payable was added to the state variable above
    function withdraw (uint _amount) public onlyHolder {
        require(address(this).balance > 0, "There is no value in this contract");
        require(checkIfICanWithdraw(_amount), "You are trying to withdraw more than your stake");
        _burn(msg.sender, checkTokensToBurn(_amount));
        transferXDai(payable(msg.sender), _amount); 
    }



   
}