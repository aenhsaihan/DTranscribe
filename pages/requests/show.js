import React, { Component } from 'react';
import Layout from '../../components/Layout';

class RequestShow extends Component {
  static async getInitialProps(props) {
    console.log(props.query.address);
    return {};
  }

  render() {
    return (
      <Layout>
        <h3>Request Show</h3>
      </Layout>
    );
  }
}

export default RequestShow;
