import web3 from './web3';

const artifacts = require('../build/contracts/TranscriptionFactory.json');
const contract = require('truffle-contract');

const TranscriptionFactory = contract(artifacts);
TranscriptionFactory.setProvider(web3.currentProvider);
if (typeof TranscriptionFactory.currentProvider.sendAsync !== 'function') {
  TranscriptionFactory.currentProvider.sendAsync = function() {
    return TranscriptionFactory.currentProvider.send.apply(
      TranscriptionFactory.currentProvider,
      arguments
    );
  };
}

const instance = TranscriptionFactory.at(
  '0x1ff10204d5343698177d4f066940ec1708c2559e'
);

export default instance;
