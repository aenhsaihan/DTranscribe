const CaptureFile = {
  buffer: '',

  captureFile: (event, callback) => {
    event.stopPropagation();
    event.preventDefault();
    const file = event.target.files[0];
    let reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => convertToBuffer(reader);

    const convertToBuffer = async reader => {
      // file is converted to a buffer for upload to IPFS
      this.buffer = await Buffer.from(reader.result);
      callback(this.buffer);
    };
  }
};

export default CaptureFile;
