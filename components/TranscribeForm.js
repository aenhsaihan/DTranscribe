import React, { Component } from 'react';
import { Button, Form, Input, Message } from 'semantic-ui-react';
import TranscriptionRequest from '../ethereum/transcriptionRequest';
import web3 from '../ethereum/web3';
import { Router } from '../routes';

class TranscribeForm extends Component {
  state = {
    transcriptionIPFSHash: '',
    errorMessage: '',
    loading: false
  };

  onSubmit = async event => {
    event.preventDefault();

    const transcriptionRequest = TranscriptionRequest(this.props.address);

    this.setState({ loading: true, errorMessage: '' });

    try {
      const accounts = await web3.eth.getAccounts();
      await transcriptionRequest.transcribeRequest(
        this.state.transcriptionIPFSHash,
        {
          from: accounts[0]
        }
      );

      Router.replaceRoute(`/requests/${this.props.address}`);
    } catch (err) {
      this.setState({ errorMessage: err.message });
    } finally {
      this.setState({ loading: false, transcriptionIPFSHash: '' });
    }
  };

  render() {
    return (
      <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
        <Form.Field>
          <label>Submit Transcription IPFS Hash here</label>
          <Input
            value={this.state.transcriptionIPFSHash}
            onChange={event =>
              this.setState({ transcriptionIPFSHash: event.target.value })
            }
            label="https://ipfs.io/ipfs/"
            placeholder="QmfWCE442XEYHoSWRTVtjKjNAsEDkDm4EF9zuTrgVmhZ9i"
          />
        </Form.Field>

        <Message error header="Oops!" content={this.state.errorMessage} />
        <Button primary loading={this.state.loading}>
          Transcribe!
        </Button>
      </Form>
    );
  }
}

export default TranscribeForm;
