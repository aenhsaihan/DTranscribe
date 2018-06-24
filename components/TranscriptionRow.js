import React, { Component } from 'react';
import { Table, Button } from 'semantic-ui-react';
import TranscriptionRequest from '../ethereum/transcriptionRequest';
import web3 from '../ethereum/web3';

class TranscriptionRow extends Component {
  onVote = async () => {
    const transcriptionRequest = TranscriptionRequest(this.props.address);

    const transcriberId = this.props.id;
    const transcriber = this.props.transcription[3];

    const [account] = await web3.eth.getAccounts();
    await transcriptionRequest.voteForTranscriber(transcriber, transcriberId, {
      from: account
    });
  };

  render() {
    const { Row, Cell } = Table;

    const { id, transcription } = this.props;

    const [votes, typeOfRequest, ipfsHash, transcriber] = transcription;

    return (
      <Row>
        <Cell>{id}</Cell>
        <Cell>{transcriber}</Cell>
        <Cell>{typeOfRequest.toNumber()}</Cell>
        <Cell>{ipfsHash}</Cell>
        <Cell>{votes.toNumber()}</Cell>
        <Cell>
          <Button color="green" basic onClick={this.onVote}>
            Vote
          </Button>
        </Cell>
        <Cell>
          <Button color="blue" basic>
            Choose
          </Button>
        </Cell>
      </Row>
    );
  }
}

export default TranscriptionRow;
