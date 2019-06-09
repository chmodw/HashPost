pragma solidity ^0.5.0;

contract Posts{

    /**
        Post struct
     */
    struct Post{
        string heading;
        string content;
        address postedBy;
        uint postedOn;
    }

    struct Comment{
        uint64 postId;
        string content;
        address postedBy;
        uint postedOn;
    }

    uint64 public postsCount;
    uint64 public commentsCount;
    
    /**
        Store posts in a mapping
     */
    mapping(uint64 => Post) public postsMap;
    /**
        Store comments in a mapping
     */
    mapping(uint64 => Comment) public commentsMap;

    /**
        Create new Post
     */
    function newPost(string memory heading,string memory content,uint postedOn) public
    {
        postsCount++;
        postsMap[postsCount] = Post(heading,content,msg.sender,postedOn);

    }

    /**
        Create new Comment
     */
    function newComment(uint64 postId,string memory content,uint postedOn) public
    {
        commentsCount++;
        commentsMap[commentsCount] = Comment(postId,content,msg.sender,postedOn);

    }
}

