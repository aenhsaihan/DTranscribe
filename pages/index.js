import React, { Component } from 'react';
import { Card, Button } from 'semantic-ui-react';
import factory from '../ethereum/factory';

class TranscriptionIndex extends Component {
  static async getInitialProps() {
    const transcriptionRequests = await factory.getDeployedTranscriptionRequests.call();

    return {
      transcriptionRequests
    };
  }

  renderTranscriptionRequests() {
    const items = this.props.transcriptionRequests.map(address => {
      return {
        header: address,
        description: <a>View Transcription Request</a>,
        fluid: true
      };
    });

    return <Card.Group items={items} />;
  }

  render() {
    return (
      <div>
        <link
          rel="stylesheet"
          href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.3.1/semantic.min.css"
        />

        {this.renderTranscriptionRequests()}
        <Button content="Create Request" icon="add circle" primary />
      </div>
    );
  }
}

export default TranscriptionIndex;
