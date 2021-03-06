import React, { Component } from 'react';
import { Card, Button } from 'semantic-ui-react';
import factory from '../ethereum/factory';
import Layout from '../components/Layout';
import { Link } from '../routes';

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
        description: (
          <Link route={`/requests/${address}`}>
            <a>View Transcription Request</a>
          </Link>
        ),
        fluid: true
      };
    });

    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
        <div>
          <h3>Open Transcription Requests</h3>

          <Link route="/requests/new">
            <a>
              <Button
                floated="right"
                content="Create Request"
                icon="add circle"
                primary
              />
            </a>
          </Link>

          {this.renderTranscriptionRequests()}
        </div>
      </Layout>
    );
  }
}

export default TranscriptionIndex;
