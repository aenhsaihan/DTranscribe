import React, { Component } from 'react';
import factory from '../ethereum/factory';

class TranscriptionIndex extends Component {
  static async getInitialProps() {
    const transcriptionRequests = await factory.getDeployedTranscriptionRequests.call();

    return {
      transcriptionRequests
    };
  }

  render() {
    return <div>{this.props.transcriptionRequests[0]}</div>;
  }
}

export default TranscriptionIndex;
