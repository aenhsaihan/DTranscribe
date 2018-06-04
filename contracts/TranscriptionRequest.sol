pragma solidity ^0.4.18;

contract TranscriptionFactory {

    address public owner = msg.sender;

    mapping (address => bool) public verifiedTranscriptionRequests;
    mapping (address => address[]) public transcriptionRequestsByRequester;

    address[] public deployedTranscriptionRequests;

    event TranscriptRequested(address requester, address request);

    function createTranscriptionRequest() public {
        address newTranscriptionRequest = new TranscriptionRequest(msg.sender);
        deployedTranscriptionRequests.push(newTranscriptionRequest);
        verifiedTranscriptionRequests[newTranscriptionRequest] = true;
        transcriptionRequestsByRequester[msg.sender].push(newTranscriptionRequest);

        emit TranscriptRequested(msg.sender, newTranscriptionRequest);
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

    RequestType typeOfRequest;
    enum RequestType { Text, Audio }

    uint public startTime = now;
    uint public durationOfTranscriptionPhase;
    uint public durationOfVoting;

    bytes32 targetLanguage;
    bytes32 targetAccent;

    string public textRequestIPFSHash;
    string public audioRequestIPFSHash;

    struct Transcription {
        uint votes;
        address[] voters;
        RequestType typeOfRequest;
        string transcriptionIPFSHash;
        address transcriber;
    }

    Transcription[] transcriptions;

    event TextTranscribed(address transcriber);
    event AudioTranscribed(address transcriber);
    event TranscriptionPhaseHasEnded();
    event VotingHasEnded();
    event RewardRefunded();
    event RewardReleased();

    constructor(address _requester) public {
        requester = _requester;
    }

    function transcribeText(string _transcriptionIPFSHash) public {

        Transcription memory transcription = Transcription({
            votes: 0,
            voters: new address[](0),
            typeOfRequest: typeOfRequest,
            transcriptionIPFSHash: _transcriptionIPFSHash,
            transcriber: msg.sender
            });
        transcriptions.push(transcription);
    }
}
