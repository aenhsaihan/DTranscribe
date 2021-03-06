const timeTravel = require('../test-helpers/timeTravel');

const chai = require('chai'),
  expect = chai.expect,
  should = chai.should();

const TranscriptionFactory = artifacts.require('TranscriptionFactory');
const TranscriptionRequest = artifacts.require('TranscriptionRequest');

contract(
  'Transcriptions',
  ([
    owner,
    requester,
    transcriber,
    secondTranscriber,
    bogusTranscriber,
    voterOne,
    voterTwo,
    voterThree,
    nonparticipant
  ]) => {
    let transcriptionFactory;
    let transcriptionRequestAddress;
    let transcriptionRequest;
    let transcription;

    const requestType = 0; // 0 for test, 1 for audio transcription request
    const requestIPFSHash = 'QmfWCE442XEYHoSWRTVtjKjNAsEDkDm4EF9zuTrgVmhZ9i';
    const durationOfTranscriptionPhase = 60;
    const durationOfVoting = 60;
    const targetLanguage = 'Spanish';
    const targetAccent = 'Spaniard';
    const reward = '5';

    before('setup factory and deploy request contract', async function() {
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
      transcriptionRequest = TranscriptionRequest.at(
        transcriptionRequestAddress
      );
    });

    const transcriptionIPFSHash =
      'QmWmyoMoctfbAaiEs2G46gpeUmhqFRDW6KWo64y5r581Vz';

    describe('Transcription Factory', () => {
      // making sure that the factory can be deployed
      // the factory should also be able to produce a transcription request
      it('deploys a factory and a transcription request', () => {
        transcriptionFactory.address.should.exist;
        transcriptionRequest.address.should.exist;
      });

      // the creator of the factory should also be its owner
      it('marks caller as the owner', async function() {
        const factoryOwner = await transcriptionFactory.owner();
        factoryOwner.should.equal(owner);
      });

      // the transcription factory should have at least one transcription request in its inventory
      it('should have created one transcription request', async function() {
        const transcriptionRequestsLength = await transcriptionFactory.getTranscriptionRequestsCount.call();
        transcriptionRequestsLength.toNumber().should.equal(1);
      });

      // the account that created the request should be the requester
      it('requester should have created the transcription request', async function() {
        const creator = await transcriptionRequest.requester.call();
        creator.should.be.a('string').that.equals(requester);
      });

      // the address of the request should be kept in the factory for later verification
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

    describe('Transcription Request: Transcription Phase', () => {
      // an account should be able to transcribe a request during the transcription phase
      it('should transcribe a request during the transcription phase', async function() {
        const now = Date.now() / 1000;
        const transcriptionPhaseEndTime = await transcriptionRequest.transcriptionPhaseEndTime.call();
        now.should.be.below(transcriptionPhaseEndTime.toNumber());

        await transcriptionRequest.transcribeRequest(transcriptionIPFSHash, {
          from: transcriber
        });
        transcription = await transcriptionRequest.transcriptions.call(0);
        transcription.should.exist;
      });

      // the transcribing account should be recorded in the contract for later verification
      // to prevent the same account from submitting multiple transcriptions
      it('transcriber should be verified', async function() {
        const verifiedTranscriber = await transcriptionRequest.verifiedTranscribers.call(
          transcriber
        );
        verifiedTranscriber.should.be.true;
      });

      it('transcriber should not be allowed to send multiple transcriptions', async function() {
        try {
          await transcriptionRequest.transcribeRequest(transcriptionIPFSHash, {
            from: transcriber
          });
          assert(
            false,
            'transcriber should not be able to send multiple transcriptions'
          );
        } catch (err) {
          err.should.exist;
        }
      });

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

      it('requester should not be able to transcribe his own request', async function() {
        try {
          await transcriptionRequest.transcribeRequest(transcriptionIPFSHash, {
            from: requester
          });
          assert(false, 'requester should not be able to transcribe');
        } catch (err) {
          err.should.exist;
        }
      });

      it('voter should not be able to vote for a transcription during the transcription phase', async function() {
        const now = Date.now() / 1000;
        const transcriptionPhaseEndTime = await transcriptionRequest.transcriptionPhaseEndTime.call();
        now.should.be.below(transcriptionPhaseEndTime.toNumber());

        try {
          await transcriptionRequest.voteForTranscriber(transcriber, 0, {
            from: voterOne
          });
          assert(
            false,
            'voter should not be able to vote for a transcription before the voting phase begins'
          );
        } catch (err) {
          err.should.exist;
        }
      });
    });

    describe('Transcription Request: Voting Phase', () => {
      it('requester should not be able to vote for a transcription', async function() {
        try {
          await transcriptionRequest.voteForTranscriber(transcriber, 0, {
            from: requester
          });
          assert(
            false,
            'requester should not be able to vote for a transcription'
          );
        } catch (err) {
          err.should.exist;
        }
      });

      it('transcriber should not be able to vote for his own transcription', async function() {
        try {
          await transcriptionRequest.voteForTranscriber(transcriber, 0, {
            from: transcriber
          });
          assert(
            false,
            'transcriber should not be able to vote for his own transcription'
          );
        } catch (err) {
          err.should.exist;
        }
      });

      it('voter should not be able to vote for a non-existent transcription', async function() {
        try {
          await transcriptionRequest.voteForTranscriber(bogusTranscriber, 0, {
            from: voterOne
          });
          assert(
            false,
            'voter should not be able to vote for a non-existent transcription'
          );
        } catch (err) {
          err.should.exist;
        }
      });

      it('voter should be able to vote for a transcription during the voting phase', async function() {
        const transcriptionPhaseEndTime = await transcriptionRequest.transcriptionPhaseEndTime.call();
        const votingEndTime = await transcriptionRequest.votingEndTime.call();

        let timestamp = await web3.eth.getBlock(web3.eth.blockNumber).timestamp;
        const timeToEndOfTranscription =
          transcriptionPhaseEndTime.toNumber() - timestamp;
        await timeTravel(timeToEndOfTranscription);

        timestamp = await web3.eth.getBlock(web3.eth.blockNumber).timestamp;
        timestamp.should.be.within(
          transcriptionPhaseEndTime.toNumber(),
          votingEndTime.toNumber()
        );

        await transcriptionRequest.voteForTranscriber(transcriber, 0, {
          from: voterOne
        });

        const votedTranscription = await transcriptionRequest.transcriptions.call(
          0
        );

        const votes = votedTranscription[0].toNumber();
        votes.should.equal(1);
      });

      it('voter should not be able to vote more than once', async function() {
        try {
          await transcriptionRequest.voteForTranscriber(transcriber, {
            from: voterOne
          });
          assert(false, 'voter should not be able to vote more than once');
        } catch (err) {
          err.should.exist;
        }
      });

      it('another voter should be able to vote for the same transcription', async function() {
        await transcriptionRequest.voteForTranscriber(transcriber, 0, {
          from: voterTwo
        });

        const votedTranscription = await transcriptionRequest.transcriptions.call(
          0
        );

        const votes = votedTranscription[0].toNumber();
        votes.should.equal(2);
      });

      it('no one should be able to declare no show before voting phase is over', async function() {
        try {
          await transcriptionRequest.noShow({
            from: nonparticipant
          });
          assert(
            false,
            'no one should be able to declare no show before voting ends'
          );
        } catch (err) {
          err.should.exist;
        }
      });

      it('another voter should not be able to vote if voting phase has ended', async function() {
        const votingEndTime = await transcriptionRequest.votingEndTime.call();
        let timestamp = await web3.eth.getBlock(web3.eth.blockNumber).timestamp;
        const timeToEndOfVoting = votingEndTime.toNumber() - timestamp;
        await timeTravel(timeToEndOfVoting);

        timestamp = await web3.eth.getBlock(web3.eth.blockNumber).timestamp;
        timestamp.should.be.at.least(votingEndTime.toNumber());

        try {
          await transcriptionRequest.voteForTranscriber(transcriber, {
            from: voterThree
          });
          assert(
            false,
            'voter should not be able to vote after voting phase is over'
          );
        } catch (err) {
          err.should.exist;
        }
      });
    });

    describe('Transcription Request: Distribute Reward', () => {
      it('should not be able to reward a non-existent transcriber', async function() {
        try {
          await transcriptionRequest.rewardWinner(bogusTranscriber, {
            from: requester
          });
          assert(false, 'requester should not reward non-existent transcriber');
        } catch (err) {
          err.should.exist;
        }
      });

      it('only requester should be able to reward winner', async function() {
        try {
          await transcriptionRequest.rewardWinner(transcriber, 0, {
            from: nonparticipant
          });
          assert(false, 'requester should not reward non-existent transcriber');
        } catch (err) {
          err.should.exist;
        }
      });

      it('requester should be able to reward winner', async function() {
        await transcriptionRequest.rewardWinner(transcriber, 0, {
          from: requester
        });
      });
    });
  }
);
