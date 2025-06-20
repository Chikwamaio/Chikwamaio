// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
//pragma solidity ^0.5.8;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract CashPoints is ERC20 {
    struct CashPoint {
        string _name; //short Name
        int256 latitude; // latitude coordinate
        int256 longitude; // longitude coordinate
        uint accuracy; // accuracy of the location in meters
        string city;
        string _phoneNumber;
        string _currency;
        uint _buy; //local currency to usd buy rate
        uint _sell; //local currency to usd sell rate
        uint _endTime; //when time as cashpoint will expire
        bool _isCashPoint;
    }

    mapping(address => CashPoint) public cashpoints;
    mapping(uint => address) public keys;
    event CreatedCashPoint(address cashpoint);
    event UpdatedCashPoint(address cashpoint);
    event Received(address, uint);
    //add the keyword payable to the state variable
    address payable public Owner;
    uint public constant MAX_SUPPLY = 100000;
    uint public AVAILABLE_TOKENS;
    uint public PRICE_PER_TOKEN; //erc20 token price
    uint public CASHPOINT_FEE = 0.5 ether;
    uint public TRANSACTION_COMMISION = 1; //percentage commission on transactions routed through the contract
    uint public count = 0;
    bool public reentrancyLock = false; // Added reentrancyLock

    constructor() ERC20("Chikwama", "CHK") {
        Owner = payable(msg.sender);
        _mint(Owner, 10000);
        AVAILABLE_TOKENS = 90000;
    }

    receive() external payable {
        setPrice();
        emit Received(msg.sender, msg.value);
    }

    // Define the nonReentrant modifier
    modifier nonReentrant() {
        require(!reentrancyLock, "Reentrancy is not allowed");
        reentrancyLock = true;
        _;
        reentrancyLock = false;
    }

    function setPrice() public {
        require(address(this).balance > 0, "There is no value in this contract");
        PRICE_PER_TOKEN = (address(this).balance / totalSupply());
    }

    function buyTokens(uint _amount) external payable nonReentrant {
        require(_amount * PRICE_PER_TOKEN == msg.value, "You are sending the wrong amount to this contract");
        require(totalSupply() + _amount <= MAX_SUPPLY, "Max supply reached");
        _mint(msg.sender, _amount);
        setPrice();
        AVAILABLE_TOKENS -= _amount;
    }

    function addCashPoint(string memory name, int lat, int long, uint accuracy, string memory city, string memory phone, string memory currency, uint buy, uint sell, uint endtime, uint duration) external payable nonReentrant {
        uint fee = duration * CASHPOINT_FEE;
        require(msg.value == fee, "Please pay the recommended fee");
        require(!cashpoints[msg.sender]._isCashPoint, "Already a cashpoint");
        cashpoints[msg.sender] = CashPoint(name, lat, long, accuracy, city, phone, currency, buy, sell, endtime, true);
        count++;
        keys[count] = msg.sender;
        setPrice();
        emit CreatedCashPoint(msg.sender);
    }

    function updateCashPoint(string memory name,int lat, int long, uint accuracy, string memory city, string memory phone, string memory currency, uint buy, uint sell, uint endtime, uint duration) external payable nonReentrant {
        uint fee = duration * CASHPOINT_FEE;
        require(msg.value == fee, "Please pay the recommended fee");
        require(cashpoints[msg.sender]._isCashPoint, "Not a cashpoint");
        cashpoints[msg.sender] = CashPoint(name, lat, long, accuracy, city, phone, currency, buy, sell, endtime, true);
        setPrice();
        emit UpdatedCashPoint(msg.sender);
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

    function checkIfICanWithdraw(uint256 _tokens) public view returns (bool)
    {
        return balanceOf(msg.sender) >= _tokens;
    }

    function checkAmountToTransfer(uint _tokens) public view returns (uint256)
    {
        uint amount = _tokens*PRICE_PER_TOKEN;
        return amount;
    }
    

    //holders can withdraw from the contract because payable was added to the state variable above
    function withdraw (uint _tokens) public onlyHolder nonReentrant{
        setPrice();
        require(address(this).balance > 0, "There is no value in this contract");
        require(checkIfICanWithdraw(_tokens), "You are trying to withdraw more than your stake");
        _burn(msg.sender, _tokens);
        AVAILABLE_TOKENS += _tokens;
        transferXDai(payable(msg.sender), checkAmountToTransfer(_tokens));
    }
    
    function send(uint _amount, address _to) external payable nonReentrant{
      uint fee = (TRANSACTION_COMMISION/100) * _amount;
      uint total = fee + _amount;
      require(msg.value >= total, "Not enough funds sent");
      transferXDai(payable(_to), _amount);
      setPrice(); 
    }

   
}