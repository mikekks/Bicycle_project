// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol"; // 메인

contract Bicycle is ERC721Enumerable {

    uint counter;
    address owner;
    uint256 interval;
    uint256 lastTimeStamp;

    //uint public test;

    struct bikeInfo{
        string brand;
        uint year;
        uint price;
        string contact;
        uint id;
        address seller;
        string uri;
    }
    mapping(uint=>bikeInfo) public sellingList;


    uint256 lockTime = 3 days;
    uint256 refundTime = 5 days;
    struct locked{
        uint256 lock;
        uint256 refund;
        uint256 amount;
        address seller;
        bool locking;
    }
   mapping(address => locked) users;

   mapping(uint => address) buyers;
   uint totalbuyers;

    mapping(uint256 => string) public _uris;


    constructor(string memory baseURI) ERC721("BICYCLE", "BIKE") {
        counter = 0;
        owner = msg.sender;
        interval = 20;
        lastTimeStamp = block.timestamp;
    }

    modifier onlyOwner{
        require(msg.sender == owner, "Permission erR0!");
        _;
    }

    

    
    event trans(uint256 isSuccess);

    function checkUpkeep(
        bytes calldata /* checkData */
    )
        external
        view
        returns (
            bool upkeepNeeded,
            bytes memory /* performData */
        )
    {
        upkeepNeeded = (block.timestamp - lastTimeStamp) > interval;
        // We don't use the checkData in this example. The checkData is defined when the Upkeep was registered.
    }

    function performUpkeep(
        bytes calldata /* performData */
    ) external {
        //We highly recommend revalidating the upkeep in the performUpkeep function
        if ((block.timestamp - lastTimeStamp) > interval) {
            lastTimeStamp = block.timestamp;
            for(uint i=0; i<10; i++){
                auto_confirmation(buyers[i]);
            }
        }
        // We don't use the performData in this example. The performData is generated by the Keeper's call to your checkUpkeep function
    }

    function uri(uint256 tokenId) public view returns (string memory) {
        return (_uris[tokenId]);
    }

    function setTokenUri(
        uint256 tokenId,
        string memory _uri
    ) public onlyOwner {
        _uris[tokenId] = _uri;
    }


    function uploadsell(string memory _brand, uint _year, uint _price, string memory _contact, address payable _owner) public payable{
        require(msg.value >= _price/100, "not enough");

        uint Commission = msg.value - _price/100;
        payable(msg.sender).transfer(Commission);

        sellingList[counter].brand = _brand;
        sellingList[counter].year = _year;
        sellingList[counter].price = _price;
        sellingList[counter].contact = _contact;
        sellingList[counter].id = counter;
        sellingList[counter].seller = msg.sender;
        counter++;

    }

    function buy(uint _id, address payable _seller) public payable returns(bool){
        //require(msg.value >= sellingList[_id].price, "not enough to buy");
        if(msg.value < sellingList[_id].price){
            emit trans(0);
            return false;
        }

        uint change = msg.value - sellingList[_id].price;
        payable(msg.sender).transfer(change);

        users[msg.sender].lock = block.timestamp + lockTime;
        users[msg.sender].refund = block.timestamp + refundTime;
        users[msg.sender].amount = sellingList[_id].price;
        users[msg.sender].locking = true;
        users[msg.sender].seller = sellingList[_id].seller;
        buyers[totalbuyers++] = msg.sender;
        NFTmint(msg.sender, _id);
        setTokenUri(_id, sellingList[_id].uri);

        emit trans(1);
        delete sellingList[_id];
        return true;
    }

    function NFTmint(address _to, uint _tokedId) private {
        _mint(_to, _tokedId);
    }

    function purchase_confirmation() public {
        require(users[msg.sender].locking == true, "Not buyer");

        users[msg.sender].locking = false;
    }

    function seller_confirmation(address _buyer) public {
        require(block.timestamp >= users[msg.sender].refund, "It's still refund period");
        require(users[_buyer].seller == msg.sender, "Not seller");

        uint256 price = users[_buyer].amount;

        payable(msg.sender).transfer(price);

    }

    function auto_confirmation(address _buyer) public onlyOwner {
        require(block.timestamp >= users[msg.sender].refund, "It's still refund period");

        uint256 price = users[_buyer].amount;
        address seller = users[_buyer].seller;

        payable(seller).transfer(price);

    }


    function refundMoney() public {
        require(block.timestamp >= users[msg.sender].lock);

        uint256 value = users[msg.sender].amount;
        delete users[msg.sender];

        payable(msg.sender).transfer(value);
    }


    function destory(address payable _owner) public onlyOwner{
        selfdestruct(_owner);
    }
}
