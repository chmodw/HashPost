const Main = artifacts.require("./Main.sol");
const Users = artifacts.require("./Users.sol");
const Posts = artifacts.require("./Posts.sol");
const Messages = artifacts.require("./Messages.sol");


/**
 * Test main contract
 */
contract("Main", accounts=>{

    it("Stores the users address", async () =>{
        // get deployed main contract
        const main = await Main.deployed();
        //get deployed users contract
        const users = await Users.deployed();
        // set the deployed users address
        await main.setUsersAddress(users.constructor.class_defaults.from);
    });

    it("Stores the Posts address", async () =>{
        // get deployed main contract
        const main = await Main.deployed();
        //get deployed users contract
        const posts = await Posts.deployed();
        // set the deployed users address
        await main.setUsersAddress(posts.constructor.class_defaults.from);
    });

    it("stores the Messages address", async () =>{
        // get deployed main contract
        const main = await Main.deployed();
        //get deployed users contract
        const messages = await Posts.deployed();
        // set the deployed users address
        await main.setUsersAddress(messages.constructor.class_defaults.from);
    });

})


/**
 * 
 * Test Users contract
 * 
 */
contract("Users", accounts => {

    /**
     * Create a new User
     */
    it("Create a new User", async () =>{
        //get the deployed contract
        const users = await Users.deployed();
        //create a new User
        await users.newUser("chamodya","iDM4exYoyl6pIhKebzxGjSQTlbSe6MuT/8rBMZ9C2tGJHYpY7glP84aZnwIcJKnsgxGGuKn320v2NG6OLlDFAg==", new Date().toString(), { from: accounts[0] });
    });

    // it("Login a user Successfully", async () =>{
        
    //     const user = await Users.users[accounts[0]];

    //     // await users.getUser(accounts[0])

    //     // assert.equal()

    // });

});

/**
 * Test Posts contract
 */
contract("Posts", accounts =>{

    it("create a new Post", async () => {

        //create a new Post
        const posts = await Posts.deployed();

        await posts.newPost("This is a test Post", "Lorem Ipsum is simply dummy text of the printing and typesetting industry.", new Date().toString(), { from: accounts[0] })
    });
});

/**
 * Test Messages contract
 */
contract("Messages", accounts => {
    // it("sends a new message", async () => {

    // });

    console.log(accounts);
});