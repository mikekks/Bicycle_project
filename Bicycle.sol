// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol"; // 메인
//import "@openzeppelin/contracts/access/Ownable.sol";

contract Bicycle is ERC721Enumerable {

    uint counter;
    address owner;

    uint public test;

    struct bikeInfo{
        string brand;
        uint year;
        uint price;
        string contact;
        uint id;
    }

    constructor(string memory baseURI) ERC721("BICYCLE", "BIKE") {
        counter = 0;
        owner = msg.sender;
    }

    modifier onlyOwner{
        require(msg.sender == owner, "Permission erR0!");
        _;
    }

    mapping(uint=>bikeInfo) public sellingList;
    mapping(address=>uint) public buytime;

    event trans(uint256 isSuccess);

    function sell(string memory _brand, uint _year, uint _price, string memory _contact, address payable _owner) public payable{
        require(msg.sender.balance >= _price/100, "not enough");

        sellingList[counter].brand = _brand;
        sellingList[counter].year = _year;
        sellingList[counter].price = _price;
        sellingList[counter].contact = _contact;
        sellingList[counter].id = counter;
        counter++;

        _owner.send(_price/100);
    }

    function buy(uint _id, address payable _seller) public payable returns(bool){
        require(msg.sender.balance >= sellingList[_id].price, "not enough to buy");

        bool sent = _seller.send(sellingList[_id].price);
        if(sent){
            emit trans(1);
            delete sellingList[_id]; 
            buytime[msg.sender] = block.timestamp;
            return true;

        } else{
            emit trans(0);
            return false;
        }
    }

    // 봉인은 contract에게 보내서? fallback() use
    function refund() public{
        require(block.timestamp - buytime[msg.sender] < 259200, "refund");

    }

    function getEther() public{
        require(block.timestamp - buytime[msg.sender] > 259200, "refund");

    }

    function destory(address payable _owner) public onlyOwner{
        selfdestruct(_owner);
    }
}
