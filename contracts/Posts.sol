pragma solidity ^0.5.0;

contract Posts{

    /**
        Post struct
     */
    struct Post{
        string heading;
        string content;
        address postedBy;
        string postedOn;
    }

    uint public postsCount;
    
    /**
        Store posts in a mapping
     */
    mapping(uint => Post) public postsMap;

    /**
        Create new Post
     */
    function newPost(string memory heading,string memory content,string memory postedOn) public
    {
        postsCount++;
        postsMap[postsCount] = Post(heading,content,msg.sender,postedOn);

    }
}

