import React, { Component } from 'react';
import Layout from '../../components/Layout';
import TranscriptionRequest from '../../ethereum/transcriptionRequest';

class RequestShow extends Component {
  static async getInitialProps(props) {
    const transcriptionRequest = TranscriptionRequest(props.query.address);

    const summary = await transcriptionRequest.getSummary.call();

    console.log(summary);

    return {};
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
