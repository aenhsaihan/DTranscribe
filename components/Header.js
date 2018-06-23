import React from 'react';
import { Menu } from 'semantic-ui-react';
import { Link } from '../routes';

export default () => {
  return (
    <Menu style={{ marginTop: '10px' }}>
      <Link route="/">
        <a className="item">DTranscribe</a>
      </Link>

      <Menu.Menu position="right">
        <Link route="/">
          <a className="item">Requests</a>
        </Link>

        <Link route="/requests/new">
          <a className="item">+</a>
        </Link>
      </Menu.Menu>
    </Menu>
  );
};
