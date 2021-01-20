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
      activePage: 0,
      saveEdit: false,
      sleeping: false,
      pagesLocked: false
    };
    this.handlesForDataToSave = [];
    this.handlesSaveEdits = [];
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

    this.initGestureSensor();
  }

  async initGestureSensor () {
    // get sensor events
    const { spawn } = await window.require('child_process');

    this.exe = spawn('node', ['-i', './src/gestureSensor/print.js']/* , { shell: true, detached: true } */);
    this.exe.stdout.on('data', data => this.handleSensorInput(data));
    this.exe.stderr.on('data', data => console.log(`stderr: ${data}`));
    this.exe.on('close', exitCode => console.error('Sensor listener exited: ' + exitCode));
    console.log(this.exe);
  }

  handleSensorInput (input) {
    const command = input.toString().substr(0, input.length - 1);
    console.log(command);

    const { sleeping, pagesLocked } = this.state;

    if (sleeping) {
      if (command === 'Up') this.setState({ sleeping: false });
    } else {
      if (!pagesLocked) {
        switch (command) {
          case 'Up':
            this.setState({ pagesLocked: true });
            break;
          case 'Down':
            this.setState({ sleeping: true });
            break;
          case 'Left':
            this.previousPage();
            break;
          case 'Right':
            this.nextPage();
            break;
          default:
            break;
        }
      } else {
        switch (command) {
          case 'Up':
            break;
          case 'Down':
            this.setState({ pagesLocked: false });
            break;
          case 'Left':
            this.previousPage();
            break;
          case 'Right':
            this.nextPage();
            break;
          default:
            break;
        }
      }
    }
  }

  componentWillUnmount () {
    this.exe.close();
  }

  async loadConfig () {
    /* const fs = await window.require('fs');

    return await new Promise((resolve, reject) => {
      // We call resolve(...) when what we were doing asynchronously was successful, and reject(...) when it failed.
      fs.readFile('./public/config.json', 'utf8', (err, data) => {
        if (err) reject(err);
        resolve(JSON.parse(data));
      });
    }); */
    const sleep = milis => new Promise(resolve => setTimeout(resolve, milis));
    await sleep(Math.random() * 1000 + 1000);
    return data;
  }

  async handleSaveConfig () {
    const data = this.dataToSave;

    console.log(data);
    console.log(JSON.stringify(data, null, 2));

    /* const fs = await window.require('fs');

    return await new Promise((resolve, reject) => {
      // We call resolve(...) when what we were doing asynchronously was successful, and reject(...) when it failed.
      fs.writeFile('.src/config/config.json', JSON.stringify(data), (err, data) => {
        if (err !== null) reject(err);
        resolve(JSON.parse(data));
      });
    }); */
  }

  get dataToSave () {
    const { apiKeys, credentials } = this.state;
    const pages = this.handlesForDataToSave.map(f => f ? f() : {});
    return { credentials, apiKeys, pages };
  }

  nextPage () {
    const { activePage, pages } = this.state;
    this.setState({ activePage: (activePage + 1) % pages.length });
  }

  previousPage () {
    const { activePage, pages } = this.state;
    this.setState({ activePage: (activePage - 1 + pages.length) % pages.length });
  }

  toggleEditMode () {
    const { editMode } = this.state;
    if (editMode) {
      const confirm = window.confirm('Pokračovat bez uložení?');
      if (!confirm) return;
    }
    this.setState({ editMode: !editMode });
  }

  saveEdit () {
    this.handlesSaveEdits.forEach(f => f());
    this.setState({ editMode: false });
  }

  render () {
    if (this.state.pages === undefined) {
      return (<div className='App App-loading'><Loader color='#eee' /></div>);
    }
    const { pages, editMode, availableWidgets, activePage, saveEdit } = this.state;
    return (
      <div className='App'>
        <Pagination activePage={activePage}>
          {
            pages.map((page, i) => (
              <Grid
                key={i}
                setSaveCallback={callback => { this.handlesForDataToSave.push(callback); }} // https://stackoverflow.com/questions/37949981/call-child-method-from-parent
                setSaveEditsCallback={callback => {
                  this.handlesSaveEdits.push(callback);
                }}
                options={page}
                editMode={editMode}
                saveEdit={saveEdit}
                availableWidgets={availableWidgets}
              />
            ))
          }
        </Pagination>
        <Button className='test' onClick={() => this.handleSensorInput('Left\n')}>Prev</Button>
        <Button className='test' onClick={this.handleSaveConfig.bind(this)}>TEST save</Button>
        <Button className='test' onClick={this.toggleEditMode.bind(this)}>Edit</Button>
        <Button className='test' onClick={this.saveEdit.bind(this)}>Save Edit</Button>
        <Button className='test' onClick={() => this.handleSensorInput('Right\n')}>Next</Button>
      </div>
    );
  }
}

export default App;
