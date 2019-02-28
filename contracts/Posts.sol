pragma solidity ^0.5.0;

contract Posts{

    /**
        Post struct
     */
    struct post{
        string heading;
        string content;
        string postedOn;
    }
    
    /**
        Store posts in a mapping
     */
    mapping(address => post[]) public postsMap;

    /**
        Create new Post
     */
    function newPost(string memory heading,string memory content,string memory postedOn) public{
        postsMap[msg.sender].push(post(heading,content,postedOn));
    }

    /**
        functions for get posts and sort them
     */
}

