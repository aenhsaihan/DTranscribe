import React, { Component } from 'react';
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

  render() {
    return (
      <Layout>
        <h3>Request Show</h3>
      </Layout>
    );
  }
}

export default RequestShow;
