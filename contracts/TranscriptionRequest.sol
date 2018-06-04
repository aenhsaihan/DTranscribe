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

    constructor(address _requester) public {
        requester = _requester;
    }
}
