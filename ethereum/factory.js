import web3 from './web3';

const TranscriptionFactory = artifacts.require('TranscriptionFactory');

const instance = TranscriptionFactory.at(
  '0x6BD6c053595cbA4a15367801cA246c8Ef65be52c'
);

export default instance;
