// const chai = require('chai'),
//   expect = chai.exect,
//   should = chai.should();

const TranscriptionFactory = artifacts.require('TranscriptionFactory');

contract('TranscriptionRequest App', ([owner]) => {
  // it('should create transription request', async () => {
  //   const instance = await TranscriptionFactory.new({
  //     from: owner
  //   });
  //
  //   await instance.createTranscriptionRequest();
  //
  //   const deployedTranscriptionRequests = await instance.deployedTranscriptionRequests;
  //   console.log(deployedTranscriptionRequests.length);
  // });

  let transcriptionFactory;

  beforeEach('setup contract for each test', async function() {
    transcriptionFactory = await TranscriptionFactory.new();
  });

  it('has an owner', async function() {
    assert.equal(await transcriptionFactory.owner(), owner);
  });
});
