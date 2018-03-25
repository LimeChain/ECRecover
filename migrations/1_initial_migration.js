var Migrations = artifacts.require("./Migrations.sol");
var ECToolsTest = artifacts.require("./ECToolsTest.sol");
var ECTools = artifacts.require("./ECTools.sol");

module.exports = function (deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(ECTools);
  deployer.link(ECTools, ECToolsTest);
  deployer.deploy(ECToolsTest);
};