import React, { Component } from 'react';
import { Form, Button, Input } from 'semantic-ui-react';
import Layout from '../../components/Layout';

class TranscriptionRequestNew extends Component {
  render() {
    return (
      <Layout>
        <h3>Create a Transcription Request</h3>

        <Form>
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
            <input />
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
