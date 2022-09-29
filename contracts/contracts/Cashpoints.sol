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
     //add the keyword payable to the state variable
    address payable public Owner;
    uint public price; //erc20 token price
    uint public cashPointPrice = 0.5 * (1 ether);

    uint public count = 0;
    
    constructor() ERC20("Chikwama", "CHK") {
        _mint(msg.sender, 100000 * (1 ether));
        Owner = payable(msg.sender); 
    }

    function setPrice() private
    {
        price = (address(this).balance/totalSupply())* (1 ether) ;
    }

    function buyTokens() external payable
    {
        setPrice();
        require(totalSupply()<=1000000 * (1 ether), "total supply reached");
        _mint(msg.sender, msg.value * price);

    }

    
    function addCashPoint(string memory name, int mylat, int mylong, string memory phone, string memory currency, uint buy, uint sell, string memory endtime, uint duration) external payable {
      uint fee = duration * cashPointPrice;
      require(msg.value > fee, "You are short");
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

    

    //holders can withdraw from the contract because payable was added to the state variable above
    function withdraw (uint _amount) public onlyHolder {
        setPrice();
        require((balanceOf(msg.sender) * price) > _amount, "You are trying to withdraw more than your stake");
        _burn(msg.sender, _amount * price);
        transferXDai(payable(msg.sender), _amount); 
    }


   
}