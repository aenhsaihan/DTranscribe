const chai = require('chai'),
  expect = chai.exect,
  should = chai.should();

const TranscriptionFactory = artifacts.require('TranscriptionFactory');

contract('TranscriptionRequest App', ([owner, requester]) => {
  let transcriptionFactory;

  beforeEach('setup contract for each test', async function() {
    transcriptionFactory = await TranscriptionFactory.new();
  });

  it('has an owner', async function() {
    const factoryOwner = await transcriptionFactory.owner();
    factoryOwner.should.equal(owner);
  });

  it('should create one transcription request', async function() {
    await transcriptionFactory.createTranscriptionRequest({
      from: requester
    });

    const transcriptionRequestsLength = await transcriptionFactory.getTranscriptionRequestsCount.call();
    transcriptionRequestsLength.toNumber().should.equal(1);
  });
});
