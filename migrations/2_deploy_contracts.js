const TranscriptionFactory = artifacts.require('./TranscriptionFactory.sol');

module.exports = function(deployer) {
  deployer.deploy(TranscriptionFactory);
};
