import React, { Component } from 'react';
import { render } from 'react-dom';

import ColorTextInput from '../src/';
import '../style/index.scss';
import './index.scss';

class App extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <ColorTextInput defaultValue="red" />
        <p> rtl </p>
        <ColorTextInput rtl />
      </div>
    );
  }
}

render(<App />, document.getElementById('content'));
