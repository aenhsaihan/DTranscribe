const chai = require('chai'),
  expect = chai.exect,
  should = chai.should();

const TranscriptionFactory = artifacts.require('TranscriptionFactory');
const TranscriptionRequest = artifacts.require('TranscriptionRequest');

contract('Transcriptions', ([owner, requester]) => {
  let transcriptionFactory;
  let transcriptionRequestAddress;
  let transcriptionRequest;

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

    transcriptionRequestAddress = await transcriptionFactory.deployedTranscriptionRequests.call(
      0
    );
    transcriptionRequest = TranscriptionRequest.at(transcriptionRequestAddress);
  });

  it('deploys a factory and a transcription request', () => {
    transcriptionFactory.address.should.exist;
    transcriptionRequest.address.should.exist;
  });

  it('marks caller as the owner', async function() {
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

contract('Transcription Request', ([owner, requester]) => {});
