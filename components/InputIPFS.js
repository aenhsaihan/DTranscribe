import React, { Component } from 'react';
import { Input } from 'semantic-ui-react';
import CaptureFile from '../captureFile';

class InputIPFS extends Component {
  captureFile = async event => {
    const fileCapturer = Object.create(CaptureFile);
    fileCapturer.captureFile(event, this.props.saveBuffer);
  };

  render() {
    return <Input type="file" onChange={this.captureFile} />;
  }
}

export default InputIPFS;
