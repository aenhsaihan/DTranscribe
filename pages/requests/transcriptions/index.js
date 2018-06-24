import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
import { Link } from '../../../routes';
import Layout from '../../../components/Layout';
import TranscriptionRequest from '../../../ethereum/transcriptionRequest';

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
  render() {
    return (
      <Layout>
        <h3>Transcriptions</h3>
        <Link>
          <a>
            <Button primary>Add Request</Button>
          </a>
        </Link>
      </Layout>
    );
  }
}

export default TranscriptionIndex;
