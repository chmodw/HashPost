pragma solidity ^0.5.0;

contract Messages{
    
    struct message{
        address sender;
        string header;
        string content;
        string createdOn;
    }
    /**
     *  Messages store in a mapping
     */
    mapping(address => message[]) public messageMap;

    /**
     * Send a new message
     */
    function sendMessage(address sender, string memory header, string memory content, string memory createOn) public{
        messageMap[msg.sender].push(message(sender,header,content,createOn));
    }

}

