User = {
    web3Provider: null,
    currentAddress: '',
    contracts: {},
  
    init: async function() {
  
      return await User.initWeb3();
    
    },
  
    initWeb3: async function() {
  
      // Modern dapp browsers...
      if (window.ethereum) {
        User.web3Provider = window.ethereum;
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
        User.web3Provider = window.web3.currentProvider;
      }
      // If no injected web3 instance is detected, fall back to Ganache
      else {
        User.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
      }
      web3 = new Web3(User.web3Provider);
    
      //Get the account address
      User.currentAddress = web3.eth.accounts[0];
  
      return User.showAddress();
    },
  
    showAddress: function(){
  
      if(User.currentAddress != null){
        document.getElementById("addressLink").textContent = 'Your Address: '+User.currentAddress;
        document.getElementById("addressLink").setAttribute('href', 'https://etherscan.io/address/'+User.currentAddress);
      }else{
        document.getElementById("current-user-hash").textContent = "Use MetaMask";
      }
  
      return User.initContract();
    },
  
    initContract: function() {
  
      $.getJSON("Posts.json", function(Posts) {
        // Instantiate a new truffle contract from the artifact
        User.contracts.Posts = TruffleContract(Posts);
        // Connect provider to interact with contract
        User.contracts.Posts.setProvider(User.web3Provider);
        
        //Load posts
        User.loadPosts();
      });
      // User.listenForEvents();
      return User.bindEvents();
    },
  
  
    bindEvents: function() {
  
    },
  
  
    loadPosts: function(){
  
    },
  };
  
  $(function() {
      
    $(window).load(function() {
      User.init();
    });
  
  });
  
  
  // SEND MESSAGES
  // REFRESH POSTS AND COMMENTS
  // USER PROFILES WITH POSTS
  // LIKES AND DISLIKES USER HEARTS