import React, { Component } from 'react';
import { Dropdown, Form, Button, Input, Radio } from 'semantic-ui-react';
import Layout from '../../components/Layout';

import countryOptions from '../../common';

class TranscriptionRequestNew extends Component {
  state = {
    requestType: '',
    ipfsHash: '',
    durationOfTranscriptionPhase: '',
    durationOfVoting: '',
    targetLanguage: '',
    targetAccent: ''
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

  render() {
    return (
      <Layout>
        <h3>Create a Transcription Request</h3>

        <Form>
          <Form.Field>
            Request type: <b>{this.state.requestType}</b>
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

          <Form.Field>
            <label>Request IPFS Hash</label>
            <Input
              label="https://ipfs.io/ipfs/"
              placeholder="QmfWCE442XEYHoSWRTVtjKjNAsEDkDm4EF9zuTrgVmhZ9i"
              value={this.state.ipfsHash}
              onChange={this.handleIPFSChange}
            />
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
        </Form>

        <Button primary>Create!</Button>
      </Layout>
    );
  }
}

export default TranscriptionRequestNew;
