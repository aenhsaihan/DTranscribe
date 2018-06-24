import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';

class TranscriptionRow extends Component {
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
        <Cell>VOTE</Cell>
      </Row>
    );
  }
}

export default TranscriptionRow;
