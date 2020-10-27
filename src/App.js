import React, { Component } from 'react';
import './App.css';

import Grid from './components/Grid.js';

import { Time } from './modules';

class App extends Component {
  constructor (props) {
    super(props);
    this.state = {
      availableWidgets: [Time],
      editMode: false
    };
  }

  render () {
    return (
      <div className='App'>
        <Grid availableWidgets={this.state.availableWidgets} />

      </div>);
  }
}

export default App;
