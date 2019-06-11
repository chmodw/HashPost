Message = {
  web3Provider: null,
  currentAddress: '',
  contracts: {},
  postsLoadedTill: 0,

  init: async function() {

    return await Message.initWeb3();
  
  },

  initWeb3: async function() {

    // Modern dapp browsers...
    if (window.ethereum) {
      Message.web3Provider = window.ethereum;
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
      Message.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      Message.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
    }
    web3 = new Web3(Message.web3Provider);
  
    //Get the account address
    Message.currentAddress = web3.eth.accounts[0];

    return Message.showAddress();
  },

  showAddress: function(){

    if(Message.currentAddress != null){
      document.getElementById("addressLink").textContent = 'Your Address: '+Message.currentAddress;
      document.getElementById("addressLink").setAttribute('href', 'https://etherscan.io/address/'+Message.currentAddress);
    }else{
      document.getElementById("current-user-hash").textContent = "Use MetaMask";
    }

    return Message.initContract();
  },

  initContract: function() {
    /**
     * get Messages Contract
     */
    $.getJSON("Messages.json", function(Messages) {
      // Instantiate a new truffle contract from the artifact
      Message.contracts.Messages = TruffleContract(Messages);
      // Connect provider to interact with contract
      Message.contracts.Messages.setProvider(Message.web3Provider);
    /**
     * get Users Contract
     */
    $.getJSON("Users.json", function(Users) {
      // Instantiate a new truffle contract from the artifact
      Message.contracts.Users = TruffleContract(Users);
      // Connect provider to interact with contract
      Message.contracts.Users.setProvider(Message.web3Provider);
    });
      //Load posts
      Message.loadMessages();
    });
    // Message.listenForEvents();
    return Message.bindEvents();
  },

  // listenForEvents: function() {
  //   Message.contracts.Posts.deployed().then(function(instance) {
  //     instance.votedEvent({}, {
  //       fromBlock: 0,
  //       toBlock: 'latest'
  //     }).watch(function(error, event) {
  //       console.log("event triggered", event)
  //       // Reload when a new vote is recorded
  //       Message.loadPosts();
  //     });
  //   });
  // },

  bindEvents: function() {
    $(document).on('click', '#sendMessage', Message.sendMessage);
  },

  sendMessage: function(event){

    //stop submitting the form
    event.preventDefault();
    //get the new post data
    newMessage = $('#newMessageForm').serializeArray();

    // send the message
    Message.contracts.Messages.deployed().then(function(instance) {
      //save the post
      instance.sendMessage(newMessage[1].value,newMessage[0].value, newMessage[2].value,Date.now().toString(), { from: Message.account });
    }).then(function() {
      //clear new post form
      document.getElementById('newMessageForm').reset();
    }).catch(function(err) {
      console.error(err);
    });

  },

  loadMessages: function(){

    Message.contracts.Messages.deployed().then(function(instance) {
      messagesInstance = instance;
      return messagesInstance.messageCount();
    }).then(function(messageCount) {

      // Loop the posts
      for (let i = messageCount; 1 <= i; i--) {

        messagesInstance.messageMap(i).then( function(result) {

          Message.contracts.Users.deployed().then(function(userInstance) {
            return userInstance.users(result[0]);
          }).then(function(userResult){

            // if(userResult[0] != ''){
            //   var username = userResult[0];
            // }else{
            //   var username = result[0];
            // }

            if(result[0] == Message.currentAddress){
              //send message
              let postedDate = new Date(Number(result[4]));
              postedDate = postedDate.getFullYear() + '-' + (postedDate.getMonth() + 1) + '-' + postedDate.getDate() + ' At ' + postedDate.getHours() + ":" + postedDate.getMinutes();


              let message = '<div  class="list-group-item list-group-item-action flex-column align-items-start">\n' +
                  '          <div class="d-flex w-100 justify-content-between">\n' +
                  '          <h5 class="mb-1">'+result[2]+' <i class="fas fa-long-arrow-alt-right"></i></h5>\n' +
                  '          <small>'+postedDate+'</small>\n' +
                  '          </div>\n' +
                  '          <p class="mb-1">'+result[3]+'</p>\n' +
                  '          <small>Send To : '+result[1]+'</small>\n' +
                  '          </div>';

              $('#message-container').append(message);

            }else if(result[1] == Message.currentAddress){
              //message to current user
              let postedDate = new Date(Number(result[4]));
              postedDate = postedDate.getFullYear() + '-' + (postedDate.getMonth() + 1) + '-' + postedDate.getDate() + ' At ' + postedDate.getHours() + ":" + postedDate.getMinutes();


              let message = '<div  class="list-group-item list-group-item-action flex-column align-items-start">\n' +
                  '          <div class="d-flex w-100 justify-content-between">\n' +
                  '          <h5 class="mb-1">'+result[2]+' <i class="fas fa-long-arrow-alt-left"></i></h5>\n' +
                  '          <small>'+postedDate+'</small>\n' +
                  '          </div>\n' +
                  '          <p class="mb-1">'+result[3]+'</p>\n' +
                  '          <small>Send By : '+result[0]+'</small>\n' +
                  '          </div>';

              $('#message-container').append(message);
            }

          });
          // var postUsername;
          //
          // Message.contracts.Users.deployed().then(function(instance) {
          //   return instance.users(result[2]);
          // }).then(function(userResult){
          // //post html
          // var post = '<div class="card mb-3 post"><div class="card-body"><h4 class="card-title">'+result[0]+'</h4><h6 class="card-subtitle mb-2 text-muted">Posted by: <a href="/profile.html?hash='+result[2]+'">'+userResult[0]+'</a></h6><p class="card-text">'+result[1]+'</p><a href="comments.html?id='+(i)+'" class="card-link">Comments</a><a href="#" class="card-link">Card link</a><a href="#" class="card-link">'+result[3]+'</a></div></div>'
          //

          // $('#post-container').append(post);

          // });

        });

      }

    })
  },
};

$(function() {
  $(window).load(function() {
    Message.init();
  });

  $(document).ready(function(){
      
  });
});


// SEND MESSAGES
// REFRESH POSTS AND COMMENTS
// USER PROFILES WITH POSTS
// LIKES AND DISLIKES USER HEARTS