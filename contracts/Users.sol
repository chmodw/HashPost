pragma solidity ^0.5.0;

contract Users{

    struct user{
        string username;
        string password;
        string createdOn;
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
        add new user
     */
    function newUser(string memory username, string memory password, string memory createdOn) public {
        users[msg.sender] = user(username,password,createdOn);
    }
    /**
        get a user detials 
     */
    function getUser(address userAddress) public view returns(string memory, string memory, string memory){
        return(users[userAddress].username,users[userAddress].password,users[userAddress].createdOn);
    }
    /**
        add a folower to a user
     */
    function addAFolower(address folower) public {
        userFollowers[msg.sender].push(folower);
    }


}