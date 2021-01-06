import React, { Component } from 'react';
import './styles/Grid.css';

import Tile from './Tile.js';

class Grid extends Component {
  constructor () {
    super();
    this.callbacksForDataToSave = [];
  }

  get numberOfTiles () {
    const { width, height } = this.props.options;
    return width * height;
  }

  passCallbacks () {
    this.props.setSaveCallback(this.getDataToSave.bind(this));
  }

  getDataToSave () {
    return this.callbacksForDataToSave.map(f => f ? f() : {});
  }

  render () {
    const handle = (callback, i) => {
      this.callbacksForDataToSave[i] = callback;

      const savedCallbacks = this.callbacksForDataToSave.reduce(
        (n, f) => n + (f ? 1 : 0),
        0
      );
      if (savedCallbacks === this.numberOfTiles) this.passCallbacks();
    }; // https://stackoverflow.com/questions/37949981/call-child-method-from-parent

    const { width, height, widgets, configs } = this.props.options;
    return (
      <div
        className='grid-container'
        style={{
          gridTemplateColumns: `repeat(${width}, 1fr)`,
          gridTemplateRows: `repeat(${height}, 1fr)`
        }}
      >
        {[...Array(this.numberOfTiles)].map((e, i) =>
          <Tile
            key={i}
            index={i}
            setSaveCallback={handle}
            editMode={this.props.editMode}
            availableWidgets={this.props.availableWidgets}
            widget={widgets[i]}
            config={configs[i]}
          />)}
      </div>
    );
  }
}

export default Grid;
