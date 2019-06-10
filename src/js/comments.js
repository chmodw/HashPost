Comments = {
  web3Provider: null,
  currentAddress: '',
  contracts: {},
  postsLoadedTill: 0,

  init: async function () {

    return await Comments.initWeb3();

  },

  initWeb3: async function () {

    // Modern dapp browsers...
    if (window.ethereum) {
      Comments.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.enable();
      } catch (error) {
        // User denied account access...
        console.error("User denied account access")
        alert('User denied account access');
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      Comments.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      Comments.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
    }
    web3 = new Web3(Comments.web3Provider);

    //Get the account address
    Comments.currentAddress = web3.eth.accounts[0];

    return Comments.showAddress();
  },

  showAddress: function () {

    if (Comments.currentAddress != null) {
      document.getElementById("addressLink").textContent = 'Your Address: ' + Comments.currentAddress;
      document.getElementById("addressLink").setAttribute('href', 'https://etherscan.io/address/' + Comments.currentAddress);
    } else {
      document.getElementById("current-user-hash").textContent = "Use MetaMask";
    }

    return Comments.initContract();
  },

  initContract: function () {

    $.getJSON("Posts.json", function (Posts) {
      // Instantiate a new truffle contract from the artifact
      Comments.contracts.Posts = TruffleContract(Posts);
      // Connect provider to interact with contract
      Comments.contracts.Posts.setProvider(Comments.web3Provider);

      //Load posts
      Comments.loadPost();
    });

    /**
     * get Users Contract
    */
    $.getJSON("Users.json", function (Users) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Users = TruffleContract(Users);
      // Connect provider to interact with contract
      App.contracts.Users.setProvider(App.web3Provider);
    });
    // Comments.listenForEvents();
    return Comments.bindEvents();
  },

  bindEvents: function () {
    $(document).on('click', '#saveComment', Comments.saveComment);
  },

  saveComment: function () {

    let userComment = $('#commentField').val();
    let postId = new URLSearchParams(window.location.search).get('id');


    Comments.contracts.Posts.deployed().then(function (instance) {
      //save the post
      instance.newComment(postId, userComment, Date.now().toString(), { from: Comments.account });
    }).then(function () {
      console.log('Comment saved');
    }).catch(function (err) {
      console.error(err);
    });
  },


  loadPost: function () {

    var postId = new URLSearchParams(window.location.search);

    Comments.contracts.Posts.deployed().then(function (instance) {
      return instance.postsMap(postId.get('id'));
    }).then(function (result) {
      var postedDate = new Date(Number(result[3]));
      postedDate = postedDate.getFullYear() + '-' + (postedDate.getMonth() + 1) + '-' + postedDate.getDate() + ' At ' + postedDate.getHours() + ":" + postedDate.getMinutes();

      $('#postedBy').text(result[2]);
      $('#postedOn').text(postedDate);
      $('#postTitle').text(result[0]);
      $('#postContent').text(result[1]);

    });

    return Comments.loadComments();
  },

  loadComments: function () {
    let postId = new URLSearchParams(window.location.search).get('id');
    Comments.contracts.Posts.deployed().then(function (instance) {
      commentInstance = instance;
      return commentInstance.commentsCount();
    }).then(function (count) {
      for (let i = count; 1 <= i; i--) {
        commentInstance.commentsMap(i).then(function (result) {
          //check if the comment is the right comment
          if (result[0] == postId) {
            var postedDate = new Date(Number(result[3]));
            postedDate = postedDate.getFullYear() + '-' + (postedDate.getMonth() + 1) + '-' + postedDate.getDate() + ' At ' + postedDate.getHours() + ":" + postedDate.getMinutes();

            let comment = '<div class="card m-3 border-primary"><div class="card-body"><p class="card-text">' + result[1] + '</p><p><span class="badge badge-primary">By: ' + result[2] + '</span><span class="badge badge-success ml-2">On: ' + postedDate + '</span></p></div></div>';

            $('#comments-container').append(comment);
          }
        });
      }
    });

  },
};

$(function () {
  $(window).load(function () {
    Comments.init();
  });

});
