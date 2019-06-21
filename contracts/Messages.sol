pragma solidity ^0.5.0;

contract Messages{
    
    struct Message{
        address from;
        string to;
        string title;
        string content;
        string createdOn;
    }
    /**
     *  Messages store in a mapping
     */
    mapping(uint => Message) public messageMap;

    uint public messageCount;

    /**
     * Send a new message
     */
    function sendMessage(string memory to, string memory title, string memory content, string memory createOn) public{
        messageCount++;
        messageMap[messageCount] = Message(msg.sender,to,title,content,createOn);
    }

}

