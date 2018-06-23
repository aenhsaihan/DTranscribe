import React, { Component } from 'react';
import { Button, Form, Input, Message } from 'semantic-ui-react';

class TranscribeForm extends Component {
  render() {
    return (
      <Form>
        <Form.Field>
          <label>Submit Transcription IPFS Hash here</label>
          <Input
            label="https://ipfs.io/ipfs/"
            placeholder="QmfWCE442XEYHoSWRTVtjKjNAsEDkDm4EF9zuTrgVmhZ9i"
          />
        </Form.Field>
        <Button primary>Transcribe!</Button>
      </Form>
    );
  }
}

export default TranscribeForm;
