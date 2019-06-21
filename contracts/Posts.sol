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

    struct UpVote{
        uint64 postId;
        address userAddress;
    }

    struct DownVote{
        uint64 postId;
        address userAddress;
    }

    uint64 public postsCount;
    uint64 public commentsCount;
    uint64 public upVoteCount;
    uint64 public downVoteCount;
    
    /**
        Store posts in a mapping
     */
    mapping(uint64 => Post) public postsMap;
    /**
        Store comments in a mapping
     */
    mapping(uint64 => Comment) public commentsMap;

    mapping(uint64 => UpVote) public upVotes;

    mapping(uint64 => DownVote) public downVotes;

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

    function voteUp(uint64 postId, address user) public{
        upVoteCount++;
        upVotes[upVoteCount] = UpVote(postId, user);
    }

    function voteDown(uint64 postId) public{
        downVoteCount++;
        downVotes[downVoteCount] = DownVote(postId, msg.sender);
    }
}

