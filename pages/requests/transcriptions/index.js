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

    const rewardReleased = false;

    return { address, transcriptions, transcriptionsCount, rewardReleased };
  }

  renderRows() {
    return this.props.transcriptions.map((transcription, index) => {
      return (
        <TranscriptionRow
          key={index}
          id={index}
          transcription={transcription}
          address={this.props.address}
          rewardReleased={this.props.rewardReleased}
        />
      );
    });
  }

  render() {
    const { Header, Row, HeaderCell, Body } = Table;

    const transcriptionRequest = TranscriptionRequest(this.props.address);
    const RewardReleased = transcriptionRequest.RewardReleased();
    RewardReleased.watch((err, result) => {
      if (err) {
        console.log(`Reward Released Event error: ${err}`);
      } else {
        console.log('Reward released!');
        this.setState({ rewardReleased: true });
      }
    });

    return (
      <Layout>
        <h3>Transcriptions</h3>

        <Table>
          <Header>
            <Row>
              <HeaderCell>ID</HeaderCell>
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
