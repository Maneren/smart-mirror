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

    // this.initGestureSensor();
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
    if (this.exe) this.exe.close();
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
    await sleep(2500);
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

    const data = this.dataToSave;
    console.log(data);
  }

  render () {
    const { sleeping, pages, editMode, availableWidgets, activePage, saveEdit } = this.state;
    if (sleeping) return <div className='App' />;
    if (pages === undefined) {
      const pathsWithLenghts = arr => arr.map((path, index) => {
        const calculatePathLength = path => {
          const el = document.getElementById('test-path');
          el.setAttribute('d', path);
          return el.getTotalLength();
        };
        const length = calculatePathLength(path);
        return (
          <path
            style={{
              strokeDasharray: length,
              strokeDashoffset: length
            }} key={index} d={path} id={0} vectorEffect='non-scaling-stroke'
          />
        );
      });
      return (
        <div className='App App-loading'>
          <div className='logo'>
            <svg width='272' height='80' viewBox='0 0 272.363 80' xmlns='http://www.w3.org/2000/svg'>
              <g id='svgGroup' strokeLinecap='round' fillRule='evenodd' fontSize='9pt' style={{ stroke: '#fff', strokeWidth: '0.6mm', fill: 'none' }}>
                {
                  pathsWithLenghts([
                    'M 0 70.118 L 0 62.11 A 49.345 49.345 0 0 0 6.876 64.414 A 57.832 57.832 0 0 0 9.57 65.04 A 50.352 50.352 0 0 0 19.824 66.114 A 34.998 34.998 0 0 0 24.391 65.836 Q 26.687 65.533 28.552 64.9 A 13.45 13.45 0 0 0 32.324 62.965 A 10.101 10.101 0 0 0 36.457 55.576 A 13.86 13.86 0 0 0 36.523 54.2 A 15.168 15.168 0 0 0 36.318 51.631 Q 35.971 49.61 35.034 48.121 Q 33.868 46.266 31.473 44.636 A 21.733 21.733 0 0 0 30.054 43.751 A 34.442 34.442 0 0 0 27.66 42.515 Q 25.199 41.351 21.684 40.032 A 142.096 142.096 0 0 0 19.434 39.21 A 57.052 57.052 0 0 1 13.892 36.915 Q 8.315 34.227 5.352 30.934 A 16.536 16.536 0 0 1 5.2 30.762 A 16.862 16.862 0 0 1 1.399 22.91 A 24.181 24.181 0 0 1 0.928 18.018 A 17.657 17.657 0 0 1 2.031 11.657 A 15.681 15.681 0 0 1 7.129 4.884 Q 13.33 0.001 23.535 0.001 A 50.72 50.72 0 0 1 36.77 1.683 A 45.054 45.054 0 0 1 43.115 3.907 L 40.527 11.134 A 48.941 48.941 0 0 0 31.007 8.185 A 39.755 39.755 0 0 0 23.34 7.423 A 24.77 24.77 0 0 0 19.324 7.728 Q 17.19 8.079 15.468 8.834 A 11.802 11.802 0 0 0 13.037 10.255 A 9.11 9.11 0 0 0 9.384 16.893 A 12.593 12.593 0 0 0 9.326 18.116 A 16.527 16.527 0 0 0 9.511 20.66 Q 9.719 21.997 10.163 23.101 A 8.607 8.607 0 0 0 10.693 24.195 A 9.751 9.751 0 0 0 12.249 26.192 Q 13.077 27.023 14.173 27.798 A 19.9 19.9 0 0 0 15.308 28.541 Q 18.02 30.192 23.133 32.134 A 116.469 116.469 0 0 0 25.244 32.911 A 77.919 77.919 0 0 1 30.862 35.144 Q 37.63 38.17 40.698 41.505 A 15.73 15.73 0 0 1 44.619 49.695 A 22.027 22.027 0 0 1 44.922 53.419 A 20.835 20.835 0 0 1 43.961 59.903 A 16.754 16.754 0 0 1 38.086 68.116 Q 32.211 72.648 22.731 73.285 A 47.718 47.718 0 0 1 19.531 73.389 A 79.319 79.319 0 0 1 12.339 73.086 Q 5.272 72.44 0.663 70.422 A 21.743 21.743 0 0 1 0 70.118 Z',
                    'M 134.619 72.413 L 126.514 72.413 L 126.514 37.598 A 23.912 23.912 0 0 0 126.273 34.082 Q 126.005 32.287 125.441 30.839 A 9.795 9.795 0 0 0 123.779 28.004 A 8.529 8.529 0 0 0 119.814 25.44 Q 118.402 24.984 116.679 24.856 A 18.815 18.815 0 0 0 115.283 24.805 Q 109.976 24.805 106.614 26.942 A 10.734 10.734 0 0 0 104.102 29.151 Q 100.505 33.477 100.488 42.447 A 45.036 45.036 0 0 0 100.488 42.53 L 100.488 72.413 L 92.383 72.413 L 92.383 37.598 A 23.912 23.912 0 0 0 92.142 34.082 Q 91.874 32.287 91.31 30.839 A 9.795 9.795 0 0 0 89.648 28.004 A 8.502 8.502 0 0 0 85.738 25.462 Q 84.331 25 82.611 24.863 A 18.98 18.98 0 0 0 81.104 24.805 Q 75.788 24.805 72.458 27.029 A 10.624 10.624 0 0 0 69.946 29.371 Q 66.406 33.936 66.406 44.337 L 66.406 72.413 L 58.301 72.413 L 58.301 18.897 L 64.893 18.897 L 66.211 26.221 L 66.602 26.221 A 15.93 15.93 0 0 1 73.071 20.118 A 19.244 19.244 0 0 1 80.672 17.986 A 23.243 23.243 0 0 1 82.422 17.921 A 26.537 26.537 0 0 1 88.395 18.543 Q 92.069 19.393 94.632 21.404 A 13.838 13.838 0 0 1 98.828 27.003 L 99.219 27.003 A 16.924 16.924 0 0 1 105.593 20.674 A 20.333 20.333 0 0 1 106.152 20.362 A 20.515 20.515 0 0 1 113.678 18.073 A 25.58 25.58 0 0 1 116.504 17.921 A 28.175 28.175 0 0 1 121.614 18.354 Q 124.455 18.878 126.673 20.039 A 13.358 13.358 0 0 1 130.103 22.584 A 13.958 13.958 0 0 1 133.099 27.486 Q 133.907 29.646 134.285 32.338 A 37.177 37.177 0 0 1 134.619 37.501 L 134.619 72.413 Z',
                    'M 190.234 72.413 L 184.229 72.413 L 182.617 64.796 L 182.227 64.796 A 33.601 33.601 0 0 1 179.508 67.839 Q 178.045 69.277 176.585 70.279 A 14.934 14.934 0 0 1 174.243 71.607 Q 170.963 73.076 166.34 73.334 A 36.477 36.477 0 0 1 164.307 73.389 A 24.875 24.875 0 0 1 159.245 72.905 Q 156.152 72.262 153.776 70.765 A 13.958 13.958 0 0 1 151.831 69.288 A 13.323 13.323 0 0 1 147.812 62.262 A 20.395 20.395 0 0 1 147.314 57.618 A 14.025 14.025 0 0 1 155.292 44.381 Q 161.696 40.974 173.242 40.626 L 182.324 40.333 L 182.324 37.012 A 23.281 23.281 0 0 0 182.098 33.646 Q 181.845 31.924 181.312 30.544 A 9.046 9.046 0 0 0 179.614 27.711 A 8.228 8.228 0 0 0 176.244 25.512 Q 174.895 25.022 173.223 24.831 A 20.027 20.027 0 0 0 170.947 24.708 Q 165.569 24.708 159.055 27.359 A 54.284 54.284 0 0 0 155.811 28.809 L 153.32 22.608 A 37.372 37.372 0 0 1 160.533 19.643 A 42.539 42.539 0 0 1 161.987 19.239 Q 166.699 18.018 171.436 18.018 A 34.233 34.233 0 0 1 176.649 18.388 Q 179.329 18.802 181.468 19.68 A 13.795 13.795 0 0 1 185.62 22.266 A 12.835 12.835 0 0 1 188.932 27.375 Q 190.234 30.909 190.234 35.889 L 190.234 72.413 Z M 182.129 50.928 L 182.129 46.095 L 174.023 46.436 A 59.515 59.515 0 0 0 169.268 46.782 Q 164.579 47.327 161.639 48.624 A 12.449 12.449 0 0 0 160.083 49.439 A 8.649 8.649 0 0 0 155.961 55.714 A 12.802 12.802 0 0 0 155.811 57.716 Q 155.811 62.11 158.472 64.405 A 8.823 8.823 0 0 0 161.777 66.16 Q 163.598 66.7 165.918 66.7 Q 173.486 66.7 177.808 62.55 Q 182.129 58.399 182.129 50.928 Z',
                    'M 237.744 18.507 L 236.621 26.026 A 35.723 35.723 0 0 0 234.052 25.552 Q 232.269 25.294 230.762 25.294 A 14.044 14.044 0 0 0 220.386 29.775 A 19.214 19.214 0 0 0 219.653 30.567 A 18.509 18.509 0 0 0 215.188 40.96 A 24.603 24.603 0 0 0 215.039 43.702 L 215.039 72.413 L 206.934 72.413 L 206.934 18.897 L 213.623 18.897 L 214.551 28.809 L 214.941 28.809 A 27.372 27.372 0 0 1 218.002 24.437 A 20.909 20.909 0 0 1 222.119 20.753 Q 226.318 17.921 231.348 17.921 A 37.211 37.211 0 0 1 234.679 18.063 A 27.159 27.159 0 0 1 237.744 18.507 Z',
                    'M 272.363 65.723 L 272.363 71.925 A 7.973 7.973 0 0 1 271.418 72.3 Q 270.409 72.634 268.965 72.892 A 30.312 30.312 0 0 1 268.481 72.974 Q 265.918 73.389 263.867 73.389 A 21.17 21.17 0 0 1 257.628 72.55 Q 248.34 69.683 248.34 57.032 L 248.34 25.196 L 240.674 25.196 L 240.674 21.29 L 248.34 17.921 L 251.758 6.495 L 256.445 6.495 L 256.445 18.897 L 271.973 18.897 L 271.973 25.196 L 256.445 25.196 L 256.445 56.69 Q 256.445 60.087 257.578 62.374 A 7.862 7.862 0 0 0 258.74 64.112 A 7.53 7.53 0 0 0 263.369 66.576 A 10.834 10.834 0 0 0 265.039 66.7 A 26.619 26.619 0 0 0 268.939 66.421 A 24.539 24.539 0 0 0 269.189 66.383 Q 271.1 66.08 272.255 65.755 A 12.172 12.172 0 0 0 272.363 65.723 Z'
                  ])
                }
              </g>
            </svg>
            <svg width='287' height='80' viewBox='0 0 287.207 80' xmlns='http://www.w3.org/2000/svg'>
              <g id='svgGroup' strokeLinecap='round' fillRule='evenodd' fontSize='9pt' style={{ stroke: '#fff', strokeWidth: '0.6mm', fill: 'none' }}>
                {
                  pathsWithLenghts([
                    'M 38.281 73.389 L 31.592 73.389 L 7.373 10.108 L 6.982 10.108 A 148.384 148.384 0 0 1 7.399 16.146 Q 7.666 21.509 7.666 27.979 L 7.666 73.389 L 0 73.389 L 0 2.003 L 12.5 2.003 L 35.107 60.889 L 35.498 60.889 L 58.301 2.003 L 70.703 2.003 L 70.703 73.389 L 62.402 73.389 L 62.402 27.393 A 211.159 211.159 0 0 1 62.619 18.062 A 269.044 269.044 0 0 1 63.086 10.206 L 62.695 10.206 L 38.281 73.389 Z',
                    'M 97.168 19.874 L 97.168 73.389 L 89.063 73.389 L 89.063 19.874 L 97.168 19.874 Z M 88.379 5.372 Q 88.379 2.588 89.746 1.295 A 4.687 4.687 0 0 1 92.755 0.014 A 6.187 6.187 0 0 1 93.164 0.001 Q 95.117 0.001 96.533 1.319 A 4.093 4.093 0 0 1 97.612 3.039 Q 97.833 3.694 97.909 4.494 A 9.272 9.272 0 0 1 97.949 5.372 A 8.386 8.386 0 0 1 97.818 6.909 Q 97.518 8.515 96.533 9.449 A 4.729 4.729 0 0 1 93.164 10.792 Q 91.113 10.792 89.746 9.449 A 4.185 4.185 0 0 1 88.726 7.774 Q 88.379 6.75 88.379 5.372 Z',
                    'M 145.166 19.483 L 144.043 27.003 A 35.723 35.723 0 0 0 141.474 26.528 Q 139.691 26.27 138.184 26.27 A 14.044 14.044 0 0 0 127.808 30.752 A 19.214 19.214 0 0 0 127.075 31.544 A 18.509 18.509 0 0 0 122.61 41.937 A 24.603 24.603 0 0 0 122.461 44.678 L 122.461 73.389 L 114.355 73.389 L 114.355 19.874 L 121.045 19.874 L 121.973 29.786 L 122.363 29.786 A 27.372 27.372 0 0 1 125.424 25.413 A 20.909 20.909 0 0 1 129.541 21.729 Q 133.74 18.897 138.77 18.897 A 37.211 37.211 0 0 1 142.101 19.039 A 27.159 27.159 0 0 1 145.166 19.483 Z',
                    'M 185.986 19.483 L 184.863 27.003 A 35.723 35.723 0 0 0 182.294 26.528 Q 180.511 26.27 179.004 26.27 A 14.044 14.044 0 0 0 168.628 30.752 A 19.214 19.214 0 0 0 167.896 31.544 A 18.509 18.509 0 0 0 163.43 41.937 A 24.603 24.603 0 0 0 163.281 44.678 L 163.281 73.389 L 155.176 73.389 L 155.176 19.874 L 161.865 19.874 L 162.793 29.786 L 163.184 29.786 A 27.372 27.372 0 0 1 166.244 25.413 A 20.909 20.909 0 0 1 170.361 21.729 Q 174.561 18.897 179.59 18.897 A 37.211 37.211 0 0 1 182.921 19.039 A 27.159 27.159 0 0 1 185.986 19.483 Z',
                    'M 241.444 54.727 A 41.868 41.868 0 0 0 242.188 46.583 A 47.57 47.57 0 0 0 242.17 45.296 Q 242.05 40.84 241.085 37.057 A 25.239 25.239 0 0 0 235.571 26.368 A 21.219 21.219 0 0 0 225.721 20.014 A 27.236 27.236 0 0 0 217.725 18.897 Q 206.104 18.897 199.561 26.197 A 22.393 22.393 0 0 0 196.81 30.011 Q 193.018 36.62 193.018 46.583 A 40.548 40.548 0 0 0 193.527 53.151 A 29.985 29.985 0 0 0 196.045 61.329 A 26.641 26.641 0 0 0 196.635 62.484 A 21.944 21.944 0 0 0 204.639 70.997 A 22.569 22.569 0 0 0 209.819 73.3 A 26.029 26.029 0 0 0 217.383 74.366 A 31.474 31.474 0 0 0 222.879 73.907 A 21.609 21.609 0 0 0 235.596 67.017 Q 239.973 62.137 241.444 54.727 Z M 201.416 46.583 A 41.046 41.046 0 0 0 201.807 52.446 Q 202.682 58.494 205.518 62.208 A 13.285 13.285 0 0 0 214.17 67.303 A 20.131 20.131 0 0 0 217.578 67.579 Q 225.537 67.579 229.663 62.232 A 17.4 17.4 0 0 0 232.373 56.955 Q 233.789 52.619 233.789 46.583 Q 233.789 40.036 232.091 35.509 A 16.689 16.689 0 0 0 229.663 31.08 A 13.334 13.334 0 0 0 221.373 26.134 A 20.443 20.443 0 0 0 217.48 25.782 A 19.29 19.29 0 0 0 212.678 26.344 A 12.91 12.91 0 0 0 205.469 31.006 A 16.759 16.759 0 0 0 202.864 36.041 Q 202.095 38.354 201.734 41.185 A 42.831 42.831 0 0 0 201.416 46.583 Z',
                    'M 287.207 19.483 L 286.084 27.003 A 35.723 35.723 0 0 0 283.515 26.528 Q 281.732 26.27 280.225 26.27 A 14.044 14.044 0 0 0 269.849 30.752 A 19.214 19.214 0 0 0 269.116 31.544 A 18.509 18.509 0 0 0 264.651 41.937 A 24.603 24.603 0 0 0 264.502 44.678 L 264.502 73.389 L 256.396 73.389 L 256.396 19.874 L 263.086 19.874 L 264.014 29.786 L 264.404 29.786 A 27.372 27.372 0 0 1 267.465 25.413 A 20.909 20.909 0 0 1 271.582 21.729 Q 275.781 18.897 280.811 18.897 A 37.211 37.211 0 0 1 284.142 19.039 A 27.159 27.159 0 0 1 287.207 19.483 Z'
                  ])
                }
              </g>
            </svg>
          </div>
          <Loader color='#eee' />
        </div>
      );
    }
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
