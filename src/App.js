import React, { Component } from 'react';
import './App.css';

import Grid from './components/Grid.js';

class App extends Component {
  constructor (props) {
    super(props);
    this.state = {
      modules: [null, null, null, null, null, null]
    };
  }

  render () {
    return (
      <div className='App'>
        <Grid modules={this.state.modules} />

      </div>);
  }
}

export default App;
