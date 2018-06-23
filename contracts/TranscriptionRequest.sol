pragma solidity ^0.4.23;


contract TranscriptionFactory {

    address public owner = msg.sender;

    mapping (address => bool) public verifiedTranscriptionRequests;
    mapping (address => address[]) public transcriptionRequestsByRequester;

    address[] public deployedTranscriptionRequests;

    event TranscriptionRequested(address requester, address request);

    constructor() public payable {
    }

    function createTranscriptionRequest(
        TranscriptionRequest.RequestType typeOfRequest,
        string requestIPFSHash,
        uint durationOfTranscriptionPhase,
        uint durationOfVoting,
        string targetLanguage,
        string targetAccent
    ) public payable {
        require(bytes(requestIPFSHash).length != 0);
        require(durationOfTranscriptionPhase > 0);
        require(durationOfVoting > 0);
        require(bytes(targetLanguage).length != 0);

        TranscriptionRequest newTranscriptionRequest = (new TranscriptionRequest).value(msg.value)(
            msg.sender,
            typeOfRequest,
            requestIPFSHash,
            durationOfTranscriptionPhase,
            durationOfVoting,
            targetLanguage,
            targetAccent
        );

        deployedTranscriptionRequests.push(newTranscriptionRequest);
        verifiedTranscriptionRequests[newTranscriptionRequest] = true;
        transcriptionRequestsByRequester[msg.sender].push(newTranscriptionRequest);

        emit TranscriptionRequested(msg.sender, newTranscriptionRequest);
    }

    function verifyTranscriptionRequest(address transcriptionRequest) view public returns (bool) {
        return verifiedTranscriptionRequests[transcriptionRequest];
    }

    function getTranscriptionRequestsCount() public view returns (uint) {
        return deployedTranscriptionRequests.length;
    }

    function getDeployedTranscriptionRequests() view public returns (address[]) {
        return deployedTranscriptionRequests;
    }
}

contract TranscriptionRequest {

    address public requester;

    uint256 public reward = address(this).balance;

    enum RequestType { Text, Audio }
    RequestType public typeOfRequest;

    uint public startTime = now;
    uint public durationOfTranscriptionPhase;
    uint public durationOfVoting;
    uint public transcriptionPhaseEndTime;
    uint public votingEndTime;

    bytes public targetLanguage;
    bytes public targetAccent;

    string public requestIPFSHash;

    struct Transcription {
        uint votes;
        address[] voters;
        RequestType typeOfRequest;
        string transcriptionIPFSHash;
        address transcriber;
    }

    Transcription[] public transcriptions;
    address[] winners;
    address[] winningVoters;

    mapping (address => Transcription) public transcriptionsMapping;
    mapping (address => bool) public verifiedTranscribers;
    mapping (address => bool) public verifiedVoters;

    event RequestTranscribed(address transcriber, RequestType transcriptionRequestType);
    event VotedForTranscription(address voter, address transcriber);
    event RewardRefunded();
    event RewardReleased();

    modifier onlyBy(address _account) {
        require(msg.sender == _account);
        _;
    }

    modifier canAskForRefund() {
        require(transcriptions.length < 2);
        _;
    }

    modifier hasTranscriptionPhaseEnded() {
        require(now <= transcriptionPhaseEndTime);
        _;
    }

    modifier hasVotingStarted() {
        require(now >= transcriptionPhaseEndTime);
        _;
    }

    modifier hasVotingEnded() {
        require(now <= votingEndTime);
        _;
    }

    constructor(address _requester, RequestType _typeOfRequest,
    string _requestIPFSHash,
    uint _durationOfTranscriptionPhase,
    uint _durationOfVoting,
    string _targetLanguage,
    string _targetAccent) public payable {
        requester = _requester;
        typeOfRequest = _typeOfRequest;
        requestIPFSHash = _requestIPFSHash;
        durationOfTranscriptionPhase = _durationOfTranscriptionPhase;
        durationOfVoting = _durationOfVoting;

        transcriptionPhaseEndTime = startTime + _durationOfTranscriptionPhase;
        votingEndTime = transcriptionPhaseEndTime + _durationOfVoting;

        targetLanguage = bytes(_targetLanguage);
        targetAccent = bytes(_targetAccent);
    }

    function transcribeRequest(string _transcriptionIPFSHash) public hasTranscriptionPhaseEnded {
        require(msg.sender != requester);
        require(verifiedTranscribers[msg.sender] != true);

        Transcription memory transcription = Transcription({
            votes: 0,
            voters: new address[](0),
            typeOfRequest: typeOfRequest,
            transcriptionIPFSHash: _transcriptionIPFSHash,
            transcriber: msg.sender
            });
        transcriptions.push(transcription);
        transcriptionsMapping[msg.sender] = transcription;
        verifiedTranscribers[msg.sender] = true;

        emit RequestTranscribed(msg.sender, typeOfRequest);
    }

    function voteForTranscriber(address transcriber) public hasVotingStarted hasVotingEnded {
        require(transcriber != msg.sender && msg.sender != requester && verifiedVoters[msg.sender] != true);

        Transcription storage transcription = transcriptionsMapping[transcriber];
        // make sure that transcriber exists
        require(transcription.transcriber != 0x0000000000000000000000000000000000000000);

        transcription.voters.push(msg.sender);
        transcription.votes = transcription.voters.length;

        // voter can't vote more than once
        verifiedVoters[msg.sender] = true;

        emit VotedForTranscription(msg.sender, transcriber);
    }

    function askForRefund() public canAskForRefund onlyBy(requester) {
        selfdestruct(requester);
        emit RewardRefunded();
    }

    function rewardWinner(address _winner) public onlyBy(requester) {
        require(verifiedTranscribers[_winner]);

        Transcription storage winningTranscription = transcriptionsMapping[_winner];
        winners.push(_winner);

        _distributeReward(winners, winningTranscription.voters, requester);
    }

    function noShow() public hasVotingEnded {

        winners = new address[](0);
        winningVoters = new address[](0);
        uint currentVotes = 0;

        for (uint i = 0; i < transcriptions.length; i++) {
            Transcription storage currentTranscription = transcriptions[i];
            address currentTranscriber = currentTranscription.transcriber;
            address[] storage currentVoters = currentTranscription.voters;

            if (currentVotes < currentTranscription.votes) {
                winners = new address[](0);
                winningVoters = new address[](0);
            }

            if (currentVotes <= currentTranscription.votes) {
                winners.push(currentTranscriber);

                for (uint j = 0; i < currentVoters.length; j++) {
                    address currentVoter = currentVoters[j];
                    winningVoters.push(currentVoter);
                }

                currentVotes = currentTranscription.votes;
            }
        }

        _distributeReward(winners, winningVoters, msg.sender);
    }

    function _distributeReward(address[] _winners, address[] _winningVoters, address rewarder) private {

        // pay out reward allocated to voters
        if (_winningVoters.length > 0) {
            // the 5% to voters is hardcoded for now
            uint voterReward = ((reward * 5) / 100) / _winningVoters.length;
            for (uint i = 0; i < _winningVoters.length; i++) {
                address winningVoter = _winningVoters[i];
                winningVoter.transfer(voterReward);
            }
        }

        uint rewardForEachWinner = reward / _winners.length;
        for (uint j = 0; i < _winners.length; j++) {
            address winner = _winners[i];
            winner.transfer(rewardForEachWinner);
        }

        // maybe any leftover ether can go to the one who resolved the conflict
        selfdestruct(rewarder);
        emit RewardReleased();
    }

    function getSummary() public view
    returns (
      uint,
      TranscriptionRequest.RequestType,
      string,
      uint,
      uint,
      uint,
      bytes,
      bytes,
      uint,
      address
    ) {
        return (
          reward,
          typeOfRequest,
          requestIPFSHash,
          startTime,
          transcriptionPhaseEndTime,
          votingEndTime,
          targetLanguage,
          targetAccent,
          transcriptions.length,
          requester
        );
    }

    function getTranscriptionsCount() view public returns (uint) {
        return transcriptions.length;
    }
}
