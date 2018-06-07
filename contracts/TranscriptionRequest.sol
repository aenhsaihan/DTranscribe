pragma solidity ^0.4.21;

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
}

contract TranscriptionRequest {

    address public requester;

    uint256 public reward = address(this).balance;

    enum RequestType { Text, Audio }
    RequestType public typeOfRequest;

    uint public startTime = now;
    uint public durationOfTranscriptionPhase;
    uint public durationOfVoting;
    uint public transcriptionPhaseEndTime = startTime + durationOfTranscriptionPhase;
    uint public votingEndTime = transcriptionPhaseEndTime + durationOfVoting;

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

    mapping (address => Transcription) public transcriptionsMapping;

    event RequestTranscribed(address transcriber, RequestType transcriptionRequestType);
    event VotedForTranscription(address voter, address transcriber);
    event RewardRefunded();
    event RewardReleased();

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
        targetLanguage = bytes(_targetLanguage);
        targetAccent = bytes(_targetAccent);
    }

    function transcribeRequest(string _transcriptionIPFSHash) public hasTranscriptionPhaseEnded {
        require(msg.sender != requester);

        Transcription memory transcription = Transcription({
            votes: 0,
            voters: new address[](0),
            typeOfRequest: typeOfRequest,
            transcriptionIPFSHash: _transcriptionIPFSHash,
            transcriber: msg.sender
            });
        transcriptions.push(transcription);
        transcriptionsMapping[msg.sender] = transcription;

        emit RequestTranscribed(msg.sender, typeOfRequest);
    }

    function voteForTranscriber(address transcriber) public hasVotingStarted hasVotingEnded {
        require(transcriber != msg.sender && msg.sender != requester);

        Transcription storage transcription = transcriptionsMapping[transcriber];
        require(transcription.transcriber != 0x0000000000000000000000000000000000000000);

        transcription.voters.push(msg.sender);
        transcription.votes = transcription.voters.length;

        emit VotedForTranscription(msg.sender, transcriber);
    }

    function askForRefund() public canAskForRefund {
        require(msg.sender == requester);
        selfdestruct(requester);
        emit RewardRefunded();
    }
}
