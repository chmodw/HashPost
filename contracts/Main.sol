pragma solidity ^0.5.0;

contract Main {
    
    //messages address
    address[] public messages;
    //posts address
    address[] public posts;
    //users address
    address[] public users;
    
    /**
        Set Messages contract address
     */
    function setMessagesAddress(address messagesAddress) public {
        messages.push(messagesAddress);
    }

    /**
        Set posts contract address
     */        
    function setPostsAddress(address postsAddress) public {
        posts.push(postsAddress);
    }

    /**
        Set Users address
     */
    function setUsersAddress(address usersAddress) public{
        users.push(usersAddress);
    }

}