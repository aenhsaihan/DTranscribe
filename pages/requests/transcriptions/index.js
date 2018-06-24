import React, { Component } from 'react';
import { Button, Table } from 'semantic-ui-react';
import { Link } from '../../../routes';
import Layout from '../../../components/Layout';
import TranscriptionRequest from '../../../ethereum/transcriptionRequest';
import TranscriptionRow from '../../../components/TranscriptionRow';

class TranscriptionIndex extends Component {
  static async getInitialProps(props) {
    const { address } = props.query;
    const transcriptionRequest = TranscriptionRequest(address);
    const transcriptionsCount = await transcriptionRequest.getTranscriptionsCount.call();

    const transcriptions = await Promise.all(
      Array(transcriptionsCount.toNumber())
        .fill()
        .map((element, index) => {
          return transcriptionRequest.transcriptions.call(index);
        })
    );

    return { address, transcriptions, transcriptionsCount };
  }

  renderRows() {
    return this.props.transcriptions.map((transcription, index) => {
      return (
        <TranscriptionRow
          key={index}
          transcription={transcription}
          address={this.props.address}
        />
      );
    });
  }

  render() {
    const { Header, Row, HeaderCell, Body } = Table;

    return (
      <Layout>
        <h3>Transcriptions</h3>

        <Table>
          <Header>
            <Row>
              <HeaderCell>Transcriber</HeaderCell>
              <HeaderCell>Type of Request</HeaderCell>
              <HeaderCell>IPFS Hash</HeaderCell>
              <HeaderCell>Votes</HeaderCell>
              <HeaderCell>Vote?</HeaderCell>
              <HeaderCell>Choose</HeaderCell>
            </Row>
          </Header>
          <Body>{this.renderRows()}</Body>
        </Table>
      </Layout>
    );
  }
}

export default TranscriptionIndex;
