import React, { Component } from 'react';
import { Card, Grid } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import TranscriptionRequest from '../../ethereum/transcriptionRequest';
import web3 from '../../ethereum/web3';
import TranscribeForm from '../../components/TranscribeForm';

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
      },
      {
        header: web3.utils.fromWei(`${reward}`, 'ether'),
        meta: 'Reward (ETH)',
        description:
          'Winning transcriber and voters will win this reward if chosen'
      },
      {
        header: requestType.toString(),
        meta: 'Request type',
        description: 'Desired format of the transcription'
      },
      {
        header: transcriptionsCount.toString(),
        meta: 'Transcriptions',
        description: 'Number of transcriptions already submitted'
      },
      {
        header: targetLanguage,
        meta: 'Language requested',
        description:
          'Requester would like the transcription in the specified language'
      },
      {
        header: targetAccent,
        meta: 'Preferred accent',
        description:
          'Requester would like the transcriber to have the specified accent'
      },
      {
        header: startTime.toString(),
        meta: 'Start time of request',
        description: 'The beginning of the request made'
      },
      {
        header: transcriptionPhaseEndTime.toString(),
        meta: 'End time of transcription submittal phase',
        description:
          'Duration of the transcription submittal phase before voting begins'
      },
      {
        header: votingEndTime.toString(),
        meta: 'End time of voting',
        description:
          'Duration of voting after transcription submittal phase has ended'
      }
    ];

    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
        <h3>Request Show</h3>
        <Grid>
          <Grid.Column width={10}>{this.renderCards()}</Grid.Column>

          <Grid.Column width={6}>
            <TranscribeForm />
          </Grid.Column>
        </Grid>
      </Layout>
    );
  }
}

export default RequestShow;
