import web3 from './web3';

const artifacts = require('../build/contracts/TranscriptionRequest.json');
const contract = require('truffle-contract');

const TranscriptionRequest = contract(artifacts);
TranscriptionRequest.setProvider(web3.currentProvider);
if (typeof TranscriptionRequest.currentProvider.sendAsync !== 'function') {
  TranscriptionRequest.currentProvider.sendAsync = function() {
    return TranscriptionRequest.currentProvider.send.apply(
      TranscriptionRequest.currentProvider,
      arguments
    );
  };
}

export default address => {
  return TranscriptionRequest.at(address);
};
