import React, { Component } from 'react';
import { Table, Button } from 'semantic-ui-react';
import TranscriptionRequest from '../ethereum/transcriptionRequest';
import web3 from '../ethereum/web3';

class TranscriptionRow extends Component {
  onVote = async () => {
    const transcriptionRequest = TranscriptionRequest(this.props.address);

    const transcriber = this.props.transcription[3];

    const [account] = await web3.eth.getAccounts();
    await transcriptionRequest.voteForTranscriber(transcriber, {
      from: account
    });
  };

  render() {
    const { Row, Cell } = Table;

    const [
      votes,
      typeOfRequest,
      ipfsHash,
      transcriber
    ] = this.props.transcription;

    return (
      <Row>
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
