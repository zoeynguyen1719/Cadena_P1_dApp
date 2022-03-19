// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract wallet {
    address public owner;
    mapping (address => uint256) public accountBalance;

    constructor() {
        owner = msg.sender;
    }

    function Balance() external view returns (uint256) {
        return accountBalance[msg.sender];
    }

    function getBalance() public view returns (uint256) {
        require(
            msg.sender == owner,
            "You must be account's owner to see the balance"
        );
        return address(this).balance;
    }

    function transfer(address payable receivingAddress, uint256 amount) public  payable{
        require(
            amount <= accountBalance[msg.sender],
            "You do not have sufficient balance to tranfer"
        );
        accountBalance[msg.sender]-= amount;
        receivingAddress.transfer(amount);
    }

    function deposit() public payable {
        require(msg.value !=0);
        accountBalance[msg.sender] += msg.value;
    }
}