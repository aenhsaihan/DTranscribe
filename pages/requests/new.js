import React, { Component } from 'react';
import { Dropdown, Form, Button, Input, Radio } from 'semantic-ui-react';
import Layout from '../../components/Layout';

import countryOptions from '../../common';

class TranscriptionRequestNew extends Component {
  state = {};
  handleChange = (e, { value }) => this.setState({ requestType: value });

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
            />
          </Form.Field>

          <Form.Field>
            <label>Duration of transcription phase</label>
            <input />
          </Form.Field>

          <Form.Field>
            <label>Duration of voting</label>
            <input />
          </Form.Field>

          <Form.Field>
            <label>Target language</label>
            <Dropdown
              placeholder="Select target language"
              fluid
              selection
              options={countryOptions}
            />
          </Form.Field>

          <Form.Field>
            <label>Target accent</label>
            <input />
          </Form.Field>
        </Form>

        <Button primary>Create!</Button>
      </Layout>
    );
  }
}

export default TranscriptionRequestNew;
