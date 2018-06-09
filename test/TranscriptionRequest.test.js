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
  const reward = '5';

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
        from: requester,
        value: reward
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

  describe('Transcription Factory', () => {
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

    it('transcription request should be verified', async function() {
      const transcriptionRequestAddress = await transcriptionFactory.deployedTranscriptionRequests.call(
        0
      );

      const verified = await transcriptionFactory.verifiedTranscriptionRequests.call(
        transcriptionRequestAddress
      );
      verified.should.be.true;
    });
  });

  describe('Transcription Request Specifications', () => {
    it('transcription request should have the specified reward amount', async function() {
      const contractReward = await transcriptionRequest.reward.call();
      contractReward
        .toNumber()
        .toString()
        .should.equal(reward);
    });

    it('transcription request should have the specified request type', async function() {
      const contractRequestType = await transcriptionRequest.typeOfRequest.call();
      contractRequestType.toNumber().should.equal(requestType);
    });

    it('transcription request should have the specified duration for the transcription and voting phases', async function() {
      const contractDurationOfTranscriptionPhase = await transcriptionRequest.durationOfTranscriptionPhase.call();

      contractDurationOfTranscriptionPhase
        .toNumber()
        .should.equal(durationOfTranscriptionPhase);

      const contractDurationOfVoting = await transcriptionRequest.durationOfVoting.call();
      contractDurationOfVoting.toNumber().should.equal(durationOfVoting);
    });

    it('transcription request should have the specified target language and accent', async function() {
      contractTargetLanguage = await transcriptionRequest.targetLanguage.call();
      contractTargetAccent = await transcriptionRequest.targetAccent.call();

      web3.toAscii(contractTargetLanguage).should.equal(targetLanguage);
      web3.toAscii(contractTargetAccent).should.equal(targetAccent);
    });

    it('transcription request should have the correct IPFS hash', async function() {
      contractIPFSHash = await transcriptionRequest.requestIPFSHash.call();
      contractIPFSHash.should.equal(requestIPFSHash);
    });
  });
});
