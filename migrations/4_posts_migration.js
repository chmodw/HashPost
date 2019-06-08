var posts = artifacts.require("./Posts.sol");

module.exports = function(deployer) {
  deployer.deploy(posts);
};
