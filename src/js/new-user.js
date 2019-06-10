NewUser = {
    web3Provider: null,
    //current user address
    currentAddress: '',
    //deployed contracts
    contracts: {},

    init: async function() {

        return await NewUser.initWeb3();

    },

    initWeb3: async function() {

        // Modern dapp browsers...
        if (window.ethereum) {
            NewUser.web3Provider = window.ethereum;
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
            NewUser.web3Provider = window.web3.currentProvider;
        }
        // If no injected web3 instance is detected, fall back to Ganache
        else {
            NewUser.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
        }
        web3 = new Web3(NewUser.web3Provider);

        //Get the account address
        NewUser.currentAddress = web3.eth.accounts[0];

        return NewUser.showAddress();
    },

    showAddress: function(){

        if(NewUser.currentAddress != null){
            document.getElementById("addressLink").textContent = 'Your Address: '+NewUser.currentAddress;
            document.getElementById("addressLink").setAttribute('href', 'https://etherscan.io/address/'+NewUser.currentAddress);
        }else{
            document.getElementById("current-user-hash").textContent = "Use MetaMask";
        }

        return NewUser.initContract();
    },

    initContract: function() {
        /**
         * get Users Contract
         */
        $.getJSON("Users.json", function(Users) {
            // Instantiate a new truffle contract from the artifact
            NewUser.contracts.Users = TruffleContract(Users);
            // Connect provider to interact with contract
            NewUser.contracts.Users.setProvider(NewUser.web3Provider);
            NewUser.isUserExists();
        });

        // NewUser.listenForEvents();
        return NewUser.bindEvents();
    },


    bindEvents: function() {
        $(document).on('click', '#signup', NewUser.newUser);
    },

    newUser: function(){
        /**
         * Save a new user
         */
        newUser = $('#new-user').serializeArray();


        // save the post
        NewUser.contracts.Users.deployed().then(function(instance) {
            //save the post
            instance.newUser(newUser[0].value,newUser[1].value, newUser[2].value, Date.now().toString(), { from: NewUser.account });
        }).then(function() {
            console.log('user saved');
        }).catch(function(err) {
            console.error(err);
        });

        NewUser.loadNewUserForm();
        console.log(newUser);
    },

    isUserExists: function(){

        NewUser.contracts.Users.deployed().then(function(instance) {
            return instance.users(NewUser.currentAddress);
        }).then(function(result){
            if(result[0] != ""){
                $('#user-exists-warning').show();
                $('#new-user').hide();
            }
        });

    },

};

$(function() {

    $(window).load(function() {
        NewUser.init();
    });

});


// SEND MESSAGES
// REFRESH POSTS AND COMMENTS
// USER PROFILES WITH POSTS
// LIKES AND DISLIKES USER HEARTS