import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import './App.css';

import Grid from './components/Grid';
import Loader from './components/Loader';
import Pagination from './components/Pagination';

import widgetsDB from './widgets';

import data from './config/config.json';

class App extends Component {
  constructor (props) {
    super(props);
    this.state = {
      availableWidgets: widgetsDB,
      editMode: false,
      pages: undefined,
      activePage: 0
    };
    this.handlesForDataToSave = [];
  }

  componentDidMount () {
    this.loadConfig().then(
      data => {
        const { apiKeys, credentials } = data;
        const pages = data.pages.map(page => {
          return {
            widgets: page.widgets.map(
              widget => {
                const type = widget.type;
                if (widget.hide || type === '') return widgetsDB.Null;
                else if (widgetsDB[type] !== undefined) return widgetsDB[type];
                else return widgetsDB.Error;
              }
            ),
            configs: page.widgets
              .map(widget => widget.config === undefined ? {} : widget.config)
              .map(config => {
                if (config.apiKey) return { ...config, apiKey: apiKeys[config.apiKey] };
                else if (config.credentials) return { ...config, credentials: credentials[config.credentials] };
                else return config;
              }),
            width: page.width,
            height: page.height
          };
        }
        );
        console.log(pages);
        this.setState({ pages, apiKeys, credentials });
      }
    );
  }

  async loadConfig () {
    // const fs = await window.require('fs');

    // return await new Promise((resolve, reject) => {
    //   // We call resolve(...) when what we were doing asynchronously was successful, and reject(...) when it failed.
    //   fs.readFile('.src/config/config.json', 'utf8', (err, data) => {
    //     if (err) reject(err);
    //     resolve(JSON.parse(data));
    //   });
    // });
    const sleep = milis => new Promise(resolve => setTimeout(resolve, milis));
    await sleep(Math.random() * 1000 + 1000);
    return data;
  }

  async handleSaveConfig () {
    const data = this.dataToSave;

    console.log(data);
    console.log(JSON.stringify(data, null, 2));

    // const fs = await window.require('fs');
    // return await new Promise((resolve, reject) => {
    //   // We call resolve(...) when what we were doing asynchronously was successful, and reject(...) when it failed.
    //   fs.writeFile('.src/config/config.json', JSON.stringify(data), (err, data) => {
    //     if (err !== null) reject(err);
    //     resolve(JSON.parse(data));
    //   });
    // });
  }

  get dataToSave () {
    const { apiKeys, credentials } = this.state;
    return { credentials, apiKeys, pages: this.handlesForDataToSave.map(f => f()) };
  }

  render () {
    if (this.state.pages === undefined) {
      return (<div className='App App-loading'><Loader color='#eee' /></div>);
    }
    this.handlesForDataToSave = [];

    return (
      <div className='App'>
        <Pagination activePage={this.state.activePage}>
          {this.state.pages.map((page, i) => (
            <Grid
              key={i}
              setSaveCallback={callback => { this.handlesForDataToSave.push(callback); }} // https://stackoverflow.com/questions/37949981/call-child-method-from-parent
              options={page}
              editMode={this.state.editMode}
              availableWidgets={this.state.availableWidgets}
            />
          ))}
        </Pagination>
        <Button className='test' onClick={this.handleSaveConfig.bind(this)}>TEST</Button>
      </div>
    );
  }
}

export default App;
