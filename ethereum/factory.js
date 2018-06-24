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
  '0x73aacbd82d7cf70b5403d48fb2c8d4109630d89a'
  // '0x1bb0e921e7d7643bb11d1ca0564a59e464b25bfe' // with += for votes
);

export default instance;
