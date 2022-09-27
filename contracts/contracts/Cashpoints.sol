// SPDX-License-Identifier:MIT
pragma solidity >=0.4.22 <0.9.0;
//pragma solidity ^0.5.8;
pragma experimental ABIEncoderV2;


contract CashPoints {
    uint public count = 0;
    
    
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
    

    //set the owner to the msg.sender
    constructor () {
        Owner = payable(msg.sender); 
    }
    
    function addCashPoint(string memory name, int mylat, int mylong, string memory phone, string memory currency, uint buy, uint sell, string memory endtime) external payable {
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
    

    //the owner can withdraw from the contract because payable was added to the state variable above
    function withdraw (uint _amount) public onlyOwner {
        Owner.transfer(_amount); 
    }
    

    //to.transfer works because we made the address above payable.
    function transfer(address payable _to, uint _amount) public onlyOwner {
        _to.transfer(_amount); //to.transfer works because we made the address above payable.
    }



   
}