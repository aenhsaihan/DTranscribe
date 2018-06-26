import React, { Component } from 'react';
import { Button, Form, Input, Message } from 'semantic-ui-react';
import InputIPFS from '../components/InputIPFS';
import TranscriptionRequest from '../ethereum/transcriptionRequest';
import web3 from '../ethereum/web3';
import ipfs from '../ethereum/ipfs';
import { Router } from '../routes';

class TranscribeForm extends Component {
  state = {
    errorMessage: '',
    loading: false,
    ipfsHash: '',
    buffer: ''
  };

  saveBuffer = buffer => {
    this.setState({ buffer });
  };

  submitTransaction = async () => {
    const transcriptionRequest = TranscriptionRequest(this.props.address);

    try {
      const accounts = await web3.eth.getAccounts();
      await transcriptionRequest.transcribeRequest(this.state.ipfsHash, {
        from: accounts[0]
      });

      Router.replaceRoute(`/requests/${this.props.address}`);
    } catch (err) {
      this.setState({ errorMessage: err.message });
    } finally {
      this.setState({ loading: false });
    }
  };

  onSubmit = async event => {
    event.preventDefault();

    this.setState({ loading: true, errorMessage: '' });

    // save document to IPFS, return its hash#, and set hash# to state
    await ipfs.add(this.state.buffer, (err, ipfsHash) => {
      console.log(err, ipfsHash);
      this.setState({ ipfsHash: ipfsHash[0].hash });

      this.submitTransaction();
    });
  };

  render() {
    return (
      <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
        <Form.Field>
          <label>Submit Transcription IPFS Hash here</label>
          <InputIPFS saveBuffer={this.saveBuffer} />
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
