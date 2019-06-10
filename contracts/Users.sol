pragma solidity ^0.5.0;

contract Users{

    struct user{
        string username;
        string country;
        string bio;
        string createdOn;
        bool isActive;
    }
    /**
        Store users of the website
     */
    mapping(address => user) public users;

    /**
        Store folowers
     */
    mapping(address => address[]) userFollowers;

    /**
        Remember the user count
     */
     uint public userCount;

    /**
        add new user
     */
    function newUser(string memory username, string memory country, string memory bio, string memory createdOn) public{
        users[msg.sender] = user(username,country,bio,createdOn, true);
        userCount++;
    }


}