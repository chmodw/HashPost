App = {
  web3Provider: null,
  currentAddress: '',
  contracts: {},

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

    });

    return App.bindEvents();
  },

  bindEvents: function() {
    // $(document).on('click', '#savePost', App.savePost);
    $(document).on('click', '#savePost', App.getPosts);
  },

  savePost: function(event){
    //stop submitting the form
    event.preventDefault();
    //get the new post data
    newPostData = $('#newPostForm').serializeArray();


    // save the post
    App.contracts.Posts.deployed().then(function(instance) {
      return instance.newPost(newPostData[0].value,newPostData[1].value, Date.now(), { from: App.account });
    }).then(function(result) {
      // Wait for votes to update
      // $("#content").hide();
      // $("#loader").show();
      console.log("loading");
    }).catch(function(err) {
      console.error(err);
    });

    console.log("Saved");

    //clear new post form
    document.getElementById('newPostForm').reset();


    return App.loadPosts;


  },

  postCount: function(){

      App.contracts.Posts.deployed().then(function(instance) {
        return instance.postsCount();
      }).then(function(result) {
        console.log(result);
      }).catch(function(err) {
        console.error(err);
      });
  
  },

  getPosts: function(){
    


      App.contracts.Posts.deployed().then(function(instance) {
        return instance.postsMap(1);
      }).then(function(result) {
        console.log(result);
      }).catch(function(err) {
        console.error(err);
      });


  },


};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
