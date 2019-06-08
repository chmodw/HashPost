var users = artifacts.require("./Users.sol");

module.exports = function(deployer) {
  deployer.deploy(users);
};
