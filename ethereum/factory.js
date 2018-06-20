import web3 from './web3';

const artifacts = require('../build/contracts/TranscriptionFactory.json');
const contract = require('truffle-contract');

const TranscriptionFactory = contract(artifacts);
TranscriptionFactory.setProvider(web3.currentProvider);

const instance = TranscriptionFactory.at(
  '0x6BD6c053595cbA4a15367801cA246c8Ef65be52c'
);

export default instance;
