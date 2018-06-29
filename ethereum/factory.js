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
  '0x23be7ec1cb6985986efffdef83c3511cf940f562'
);

export default instance;
