import React, { Component } from 'react';
import factory from '../ethereum/factory';

class TranscriptionIndex extends Component {
  async componentDidMount() {
    const transcriptionRequests = await factory.getDeployedTranscriptionRequests.call();

    console.log(transcriptionRequests);
  }

  render() {
    return <div>Transcription Index!</div>;
  }
}

export default TranscriptionIndex;
