import React, { Component } from 'react';
import './styles/Grid.css';

import Tile from './Tile.js';

class Grid extends Component {
  constructor () {
    super();
    this.callbacksForDataToSave = [];
  }

  get numberOfTiles () {
    return this.props.width * this.props.height;
  }

  passCallbacks () {
    this.props.setSaveCallback(this.getDataToSave.bind(this));
  }

  getDataToSave () {
    return this.callbacksForDataToSave.map(f => f ? f() : {});
  }

  render () {
    const handle = function (callback, i) {
      this.callbacksForDataToSave[i] = callback;

      const savedCallbacks = this.callbacksForDataToSave.reduce(
        (n, f) => n + (f ? 1 : 0),
        0
      );
      if (savedCallbacks === this.numberOfTiles) this.passCallbacks();
    }.bind(this); // https://stackoverflow.com/questions/37949981/call-child-method-from-parent
    return (
      <div className='grid-container'>
        {[...Array(this.numberOfTiles)].map((e, i) =>
          <Tile
            key={i}
            index={i}
            setSaveCallback={handle}
            editMode={this.props.editMode}
            availableWidgets={this.props.availableWidgets}
            widget={this.props.widgets[i]}
            config={this.props.configs[i]}
          />)}
      </div>
    );
  }
}

export default Grid;
