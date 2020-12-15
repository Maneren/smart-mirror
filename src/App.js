import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import './App.css';

import Grid from './components/Grid';
import Loader from './components/Loader';

import widgetsDB from './widgets';

import data from './config/config.json';

class App extends Component {
  constructor (props) {
    super(props);
    this.state = {
      availableWidgets: widgetsDB, // .entries().map(widget => widget.menuName),
      editMode: false
    };

    this.handle = callback => {
      this.getDataToSave = callback;
    }; // https://stackoverflow.com/questions/37949981/call-child-method-from-parent
  }

  componentDidMount () {
    this.loadConfig().then(
      data => {
        const widgets = data.map(
          widget => {
            const type = widget.type;
            if (widget.hide || type === '') return widgetsDB.Null;
            else if (widgetsDB[type] !== undefined) return widgetsDB[type];
            else return widgetsDB.Error;
          }
        );

        const configs = data.map(widget => widget.config === undefined ? {} : widget.config);

        // console.log(widgets, configs);
        this.setState({ widgets, configs });
      }
    );
  }

  async loadConfig () {
    // const fs = await window.require('fs');

    // const data = await new Promise((resolve, reject) => {
    //   // We call resolve(...) when what we were doing asynchronously was successful, and reject(...) when it failed.
    //   fs.readFile('.src/config/config.json', 'utf8', (err, data) => {
    //     if (err) reject(err);
    //     resolve(JSON.parse(data));
    //   });
    // });
    const sleep = milis => new Promise(resolve => setTimeout(resolve, milis));
    await sleep(Math.random() * 1000 + 500);
    // console.log(data);
    return data;
  }

  async handleSaveConfig () {
    const data = this.getDataToSave();

    console.log(data);
    console.log(JSON.stringify(data));

    // const fs = await window.require('fs');
    // return await new Promise((resolve, reject) => {
    //   // We call resolve(...) when what we were doing asynchronously was successful, and reject(...) when it failed.
    //   fs.writeFile('.src/config/config.json', JSON.stringify(data), (err, data) => {
    //     if (err !== null) reject(err);
    //     resolve(JSON.parse(data));
    //   });
    // });
  }

  render () {
    if (this.state.widgets === undefined) {
      return (<Loader />);
    }

    return (
      <div className='App'>
        <Grid
          setSaveCallback={this.handle}
          width={2} height={3}
          editMode={this.state.editMode}
          availableWidgets={this.state.availableWidgets}
          widgets={this.state.widgets}
          configs={this.state.configs}
        />
        <Button onClick={this.handleSaveConfig.bind(this)}>TEST</Button>
      </div>
    );
  }
}

export default App;
