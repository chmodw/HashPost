App = {
  web3Provider: null,
  currentAddress: '',
  contracts: {},
  postsLoadedTill: 0,

  init: async function() {

    return await App.initWeb3();
  
  },

  initWeb3: async function() {

    // Modern dapp browsers...
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
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
      App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
    }
    web3 = new Web3(App.web3Provider);
  
    //Get the account address
    App.currentAddress = web3.eth.accounts[0];

    return App.showAddress();
  },

  showAddress: function(){

    if(App.currentAddress != null){
      document.getElementById("addressLink").textContent = 'Your Address: '+App.currentAddress;
      document.getElementById("addressLink").setAttribute('href', 'https://etherscan.io/address/'+App.currentAddress);
    }else{
      document.getElementById("current-user-hash").textContent = "Use MetaMask";
    }

    return App.initContract();
  },

  initContract: function() {

    $.getJSON("Posts.json", function(Posts) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Posts = TruffleContract(Posts);
      // Connect provider to interact with contract
      App.contracts.Posts.setProvider(App.web3Provider);
    /**
     * get Users Contract
     */
    $.getJSON("Users.json", function(Users) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Users = TruffleContract(Users);
      // Connect provider to interact with contract
      App.contracts.Users.setProvider(App.web3Provider);
    });
      //Load posts
      App.loadPosts();
    });
    // App.listenForEvents();
    return App.bindEvents();
  },

  // listenForEvents: function() {
  //   App.contracts.Posts.deployed().then(function(instance) {
  //     instance.votedEvent({}, {
  //       fromBlock: 0,
  //       toBlock: 'latest'
  //     }).watch(function(error, event) {
  //       console.log("event triggered", event)
  //       // Reload when a new vote is recorded
  //       App.loadPosts();
  //     });
  //   });
  // },

  bindEvents: function() {
    $(document).on('click', '#savePost', App.savePost);
    $(document).on('click', '#load-more-posts', App.loadPosts);
  },

  savePost: function(event){

    //Show save post loading
    $('#savePost-loading').show();
    //hide the save post btn
    $('#savePost').hide();
    //stop submitting the form
    event.preventDefault();  
    //get the new post data
    newPostData = $('#newPostForm').serializeArray();
    // save the post
    App.contracts.Posts.deployed().then(function(instance) {
      //save the post
      instance.newPost(newPostData[0].value,newPostData[1].value, Date.now().toString(), { from: App.account });
    }).then(function() {
      //hide save post loading
      $('#savePost-loading').hide();
      //show the save post btn
      $('#savePost').show();
    }).catch(function(err) {
      console.error(err);
    });

    //clear new post form
    document.getElementById('newPostForm').reset();

  },

  loadPosts: function(){

    App.contracts.Posts.deployed().then(function(instance) {
      postsInstance = instance;
      return postsInstance.postsCount();
    }).then(function(postsCount) {

   
      var postsStepper = 1;
      var postsCount = Number(postsCount) - Number(App.postsLoadedTill);
      // Loop the posts
      for (let i = postsCount; 1 <= i; i--) {

        //stop function if 10 posts loaded
        if(postsStepper === 10){ break; }

        postsInstance.postsMap(i).then( function(result) {

          var postUsername;

          App.contracts.Users.deployed().then(function(instance) {
            return instance.users(result[2]);
          }).then(function(userResult){
          //post html
          var post = '<div class="card mb-3 post"><div class="card-body"><h4 class="card-title">'+result[0]+'</h4><h6 class="card-subtitle mb-2 text-muted">Posted by: <a href="/profile.html?hash='+result[2]+'">'+userResult[0]+'</a></h6><p class="card-text">'+result[1]+'</p><a href="comments.html?id='+(i)+'" class="card-link">Comments</a><a href="#" class="card-link">Card link</a><a href="#" class="card-link">'+result[3]+'</a></div></div>'


          $('#post-container').append(post);

          });

        });
        postsStepper++;
        App.postsLoadedTill++;
      }

    })
  },
};

$(function() {
  $(window).load(function() {
    App.init();
  });

  $(document).ready(function(){
      
  });
});


// SEND MESSAGES
// REFRESH POSTS AND COMMENTS
// USER PROFILES WITH POSTS
// LIKES AND DISLIKES USER HEARTS