# DTranscribe
A decentralized application on the Ethereum network to allow the creation and exchange of transcriptions for the purpose of learning languages.

# How to start

In the root directory of the project, run `npm run dev`.

Once the local server is running, it should be listening on `localhost:3000`, use Chrome to access the server.

# Tests

The explanations for why a test case was used are written as comments in the test file in the `test` directory.

# User stories

As a requester, I should be able to create a transcription request specifiyig whether I want an audio or text request. I should then be able to submit my audio or text file for transcription which will be stored in IPFS. I can then set the duration of the transcription submittal phase, the voting phase, the target language and accent I desire, and the size of the reward in ETH. Once the transaction has cleared, I should be taken back to the home page where I can view the details of my transcription request.

As a transcriber, on the transcription request details page, I should be able to view the content to be subscribed at the IPFS link, then upload my audio or text transcription during the transcription phase.

As a voter, I should be able to see the transcriptions that have been submitted, check them out, and vote for the transcription I like best.

As the requester, I should be able to see the transcriptions and choose the transcription I like best. I should be able to do those during and after the voting phase.

As a requester, I should be able to revoke my reward and kill the transcription if at least two transcriptions have not yet been submitted.

As anyone, I should be able to declare a no show if the requester has not yet chosen a transcription after the voting phase has ended.

# Known bugs

When you're on the transcription request details page, hitting the back button to navigate backwards can cause issues, use the homepage button instead in the header.

There are also little React errors that can cause issues when rendering the certain pages, a refresh usually takes care of this issue for the time being.

# Ropsten

The contract is live on the Ropsten network and can be viewed here: https://ropsten.etherscan.io/address/0x23be7ec1cb6985986efffdef83c3511cf940f562
