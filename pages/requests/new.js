import React, { Component } from 'react';
import {
  Dropdown,
  Form,
  Button,
  Input,
  Radio,
  Message
} from 'semantic-ui-react';
import Layout from '../../components/Layout';
import InputIPFS from '../../components/InputIPFS';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import { Link, Router } from '../../routes';
import ipfs from '../../ethereum/ipfs';
// import CaptureFile from '../../captureFile';

import countryOptions from '../../common';

class TranscriptionRequestNew extends Component {
  state = {
    requestType: '0',
    ipfsHash: '',
    durationOfTranscriptionPhase: '',
    durationOfVoting: '',
    targetLanguage: '',
    targetAccent: '',
    reward: '',
    errorMessage: '',
    loading: false,
    buffer: ''
  };

  handleChange = (e, { value }) => this.setState({ requestType: value });
  handleIPFSChange = (e, { value }) => this.setState({ ipfsHash: value });
  handleDurationOfTranscriptionChange = (e, { value }) =>
    this.setState({ durationOfTranscriptionPhase: value });
  handleDurationOfVotingChange = (e, { value }) =>
    this.setState({ durationOfVoting: value });
  handleLanguageChange = (e, { value }) =>
    this.setState({ targetLanguage: value });
  handleAccentChange = (e, { value }) => this.setState({ targetAccent: value });
  handleRewardChange = (e, { value }) => this.setState({ reward: value });

  // captureFile = async event => {
  //   const fileCapturer = Object.create(CaptureFile);
  //   fileCapturer.captureFile(event, this.saveBuffer);
  // };

  saveBuffer = buffer => {
    this.setState({ buffer });
  };

  submitTransaction = async () => {
    try {
      const accounts = await web3.eth.getAccounts();
      await factory.createTranscriptionRequest(
        this.state.requestType,
        this.state.ipfsHash,
        this.state.durationOfTranscriptionPhase,
        this.state.durationOfVoting,
        this.state.targetLanguage,
        this.state.targetAccent,
        {
          from: accounts[0],
          value: this.state.reward
        }
      );

      // route user to transcription requests page
      Router.pushRoute('/');
    } catch (err) {
      this.setState({ errorMessage: err.message });
    } finally {
      this.setState({ loading: false });
    }
  };

  onSubmit = async event => {
    event.preventDefault(); // prevents browser from submitting form

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
      <Layout>
        <h3>Create a Transcription Request</h3>

        <Form.Field>
          <b>Request type: {this.state.requestType}</b>
        </Form.Field>
        <Button.Group size="large" vertical labeled icon>
          <Button
            icon="microphone"
            content="Audio"
            value="0"
            onClick={this.handleChange}
          />
          <Button
            icon="keyboard outline"
            content="Text"
            value="1"
            onClick={this.handleChange}
          />
        </Button.Group>

        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Request IPFS Hash</label>
            {/* <Input type="file" onChange={this.captureFile} /> */}
            <InputIPFS saveBuffer={this.saveBuffer} />
          </Form.Field>

          <Form.Field>
            <label>Duration of transcription phase</label>
            <Input
              label="seconds"
              labelPosition="right"
              value={this.state.durationOfTranscriptionPhase}
              onChange={this.handleDurationOfTranscriptionChange}
            />
          </Form.Field>

          <Form.Field>
            <label>Duration of voting</label>
            <Input
              label="seconds"
              labelPosition="right"
              value={this.state.durationOfVoting}
              onChange={this.handleDurationOfVotingChange}
            />
          </Form.Field>

          <Form.Field>
            <label>Target language</label>
            <Dropdown
              placeholder="Select target language"
              fluid
              selection
              options={countryOptions}
              onChange={this.handleLanguageChange}
            />
          </Form.Field>

          <Form.Field>
            <label>Target accent</label>
            <Input
              value={this.state.targetAccent}
              onChange={this.handleAccentChange}
            />
          </Form.Field>

          <Form.Field>
            <label>Reward</label>
            <Input
              label="wei"
              labelPosition="right"
              value={this.state.reward}
              onChange={this.handleRewardChange}
            />
          </Form.Field>

          <Message error header="Oops!" content={this.state.errorMessage} />

          <Button loading={this.state.loading} primary>
            Create!
          </Button>
        </Form>
      </Layout>
    );
  }
}

export default TranscriptionRequestNew;
