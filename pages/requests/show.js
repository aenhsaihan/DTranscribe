import React, { Component } from 'react';
import { Card } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import TranscriptionRequest from '../../ethereum/transcriptionRequest';

class RequestShow extends Component {
  static async getInitialProps(props) {
    const transcriptionRequest = TranscriptionRequest(props.query.address);

    const summary = await transcriptionRequest.getSummary.call();

    return {
      reward: summary[0],
      requestType: summary[1],
      requestIPFSHash: summary[2],
      startTime: summary[3],
      transcriptionPhaseEndTime: summary[4],
      votingEndTime: summary[5],
      targetLanguage: summary[6],
      targetAccent: summary[7],
      transcriptionsCount: summary[8],
      requester: summary[9]
    };
  }

  renderCards() {
    const {
      reward,
      requestType,
      requestIPFSHash,
      startTime,
      transcriptionPhaseEndTime,
      votingEndTime,
      targetLanguage,
      targetAccent,
      transcriptionsCount,
      requester
    } = this.props;

    const items = [
      {
        header: requester,
        meta: 'Address of requester',
        description: 'The requester created this transcription request',
        style: { overflowWrap: 'break-word' }
      }
    ];

    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
        <h3>Request Show</h3>
        {this.renderCards()}
      </Layout>
    );
  }
}

export default RequestShow;
