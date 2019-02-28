var messages = artifacts.require("./Messages.sol");

module.exports = function(deployer) {
  deployer.deploy(messages);
};
