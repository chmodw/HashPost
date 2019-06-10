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
    });
    /**
     * get Users Contract
     */
    $.getJSON("Users.json", function(Users) {
        // Instantiate a new truffle contract from the artifact
        Profile.contracts.Users = TruffleContract(Users);
        // Connect provider to interact with contract
        Profile.contracts.Users.setProvider(Profile.web3Provider);
        Profile.isUserExists();
      });

    // Profile.listenForEvents();
    return Profile.bindEvents();
  },


  bindEvents: function() {
    $(document).on('click', '#signup', Profile.newUser);

   
  },


  loadPosts: function(){

  },

  newUser: function(){
    /**
     * Save a new user
     */
    newUser = $('#new-user').serializeArray();


    // save the post
    Profile.contracts.Users.deployed().then(function(instance) {
        //save the post
        instance.newUser(newUser[0].value,newUser[1].value, newUser[2].value, Date.now().toString(), { from: Profile.account });
      }).then(function() {
        console.log('user saved');
      }).catch(function(err) {
        console.error(err);
      });



    Profile.loadNewUserForm();
    console.log(newUser);
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

  loadNewUserForm: function(){
 
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