import React from 'react';
import Header from './Header';

export default props => {
  return (
    <div>
      <Header />
      {props.children}
      <h1>I'm a footer</h1>
    </div>
  );
};
