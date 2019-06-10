Profile = {
  web3Provider: null,
  //current user address
  currentAddress: '',
  //deployed contracts
  contracts: {},

  init: async function() {

    return await Profile.initWeb3();
  
  },

  initWeb3: async function() {

    // Modern dapp browsers...
    if (window.ethereum) {
      Profile.web3Provider = window.ethereum;
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
      Profile.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      Profile.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
    }
    web3 = new Web3(Profile.web3Provider);
  
    //Get the account address
    Profile.currentAddress = web3.eth.accounts[0];

    return Profile.showAddress();
  },

  showAddress: function(){

    if(Profile.currentAddress != null){
      document.getElementById("addressLink").textContent = 'Your Address: '+Profile.currentAddress;
      document.getElementById("addressLink").setAttribute('href', 'https://etherscan.io/address/'+Profile.currentAddress);
    }else{
      document.getElementById("current-user-hash").textContent = "Use MetaMask";
    }

    return Profile.initContract();
  },

  initContract: function() {
    /**
     * Get Posts Contract
     */
    $.getJSON("Posts.json", function(Posts) {
      // Instantiate a new truffle contract from the artifact
      Profile.contracts.Posts = TruffleContract(Posts);
      // Connect provider to interact with contract
      Profile.contracts.Posts.setProvider(Profile.web3Provider);

      Profile.loadPosts();
    });
    /**
     * get Users Contract
     */
    $.getJSON("Users.json", function(Users) {
        // Instantiate a new truffle contract from the artifact
        Profile.contracts.Users = TruffleContract(Users);
        // Connect provider to interact with contract
        Profile.contracts.Users.setProvider(Profile.web3Provider);

        Profile.loadUserInfo();
      });

    // Profile.listenForEvents();
    return Profile.bindEvents();
  },


  bindEvents: function() {

  },


  loadPosts: function(){

      Profile.contracts.Posts.deployed().then(function(instance) {
          postsInstance = instance;
          return postsInstance.postsCount();
      }).then(function(postsCount) {

          // Loop the posts
          for (let i = postsCount; 1 <= i; i--) {
            postsInstance.postsMap(i).then(function(result) {

                if(result[2] == Profile.currentAddress){
                    console.log(result);

                    var postedDate = new Date(Number(result[3]));
                    postedDate = postedDate.getFullYear() + '-' + (postedDate.getMonth() + 1) + '-' + postedDate.getDate() + ' At ' + postedDate.getHours() + ":" + postedDate.getMinutes();

                    let myPost = '<div class="card-body">' +
                        '           <h4 class="card-title">'+result[0]+'</h4>' +
                        '           <h6 class="card-subtitle mb-2 text-muted">Posted On: '+postedDate+'</h6>'+
                        '           <p class="card-text">'+result[1]+'</p>' +
                        '           <a href="comments.html?id='+i+'" class="card-link">Comments</a>' +
                        '          </div><hr>';

                    $('#my-posts').append(myPost);
                }

            });
          }

      })
  },

  isUserExists: function(){

    Profile.contracts.Users.deployed().then(function(instance) {
        return instance.users(Profile.currentAddress);
    }).then(function(result){
        if(result[0] != ""){
          $('#user-exists-warning').show();
          $('#new-user').hide();
        }
    });
    
  },

  loadUserInfo: function(){


      Profile.contracts.Users.deployed().then(function (instance) {
          return instance.users(Profile.currentAddress);
      }).then(function (result) {

          let joinedDate = new Date(Number(result[3]));
          joinedDate = joinedDate.getFullYear() + '-' + (joinedDate.getMonth() + 1) + '-' + joinedDate.getDate();

          $('#username').text(result[0]);
          $('#address').text(Profile.currentAddress);
          $('#country').text(result[1]);
          $('#bio').text(result[2]);
          $('#joinedDate').text(joinedDate);

      });



  }

};

$(function() {
    
  $(window).load(function() {
    Profile.init();
  });

});


// SEND MESSAGES
// REFRESH POSTS AND COMMENTS
// USER PROFILES WITH POSTS
// LIKES AND DISLIKES USER HEARTS