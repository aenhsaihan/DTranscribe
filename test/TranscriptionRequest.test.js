const chai = require('chai'),
  expect = chai.exect,
  should = chai.should();

const TranscriptionFactory = artifacts.require('TranscriptionFactory');
const TranscriptionRequest = artifacts.require('TranscriptionRequest');

contract('TranscriptionFactory', ([owner, requester]) => {
  let transcriptionFactory;

  const requestType = 0; // 0 for test, 1 for audio transcription request
  const requestIPFSHash = 'QmfWCE442XEYHoSWRTVtjKjNAsEDkDm4EF9zuTrgVmhZ9i';
  const durationOfTranscriptionPhase = 60;
  const durationOfVoting = 60;
  const targetLanguage = 'Spanish';
  const targetAccent = 'Spaniard';

  beforeEach('setup contract for each test', async function() {
    transcriptionFactory = await TranscriptionFactory.new();

    await transcriptionFactory.createTranscriptionRequest(
      requestType,
      requestIPFSHash,
      durationOfTranscriptionPhase,
      durationOfVoting,
      targetLanguage,
      targetAccent,
      {
        from: requester
      }
    );
  });

  it('has an owner', async function() {
    const factoryOwner = await transcriptionFactory.owner();
    factoryOwner.should.equal(owner);
  });

  it('should create one transcription request', async function() {
    const transcriptionRequestsLength = await transcriptionFactory.getTranscriptionRequestsCount.call();
    transcriptionRequestsLength.toNumber().should.equal(1);
  });

  it('requester should have created the transcription request', async function() {
    const transcriptionRequestAddress = await transcriptionFactory.transcriptionRequestsByRequester.call(
      requester,
      0
    );

    const transcriptionRequest = TranscriptionRequest.at(
      transcriptionRequestAddress
    );
    const creator = await transcriptionRequest.requester.call();
    creator.should.be.a('string').that.equals(requester);
  });

  it('transcript request should have been deployed by factory', async function() {
    const transcriptionRequestAddress = await transcriptionFactory.deployedTranscriptionRequests.call(
      0
    );

    const verified = await transcriptionFactory.verifiedTranscriptionRequests.call(
      transcriptionRequestAddress
    );
    verified.should.be.true;
  });
});
