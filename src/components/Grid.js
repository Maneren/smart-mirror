import React, { Component } from 'react';
import './styles/Grid.css';

import Tile from './Tile.js';

class Grid extends Component {
  constructor () {
    super();
    this.callbacksForDataToSave = [];
    this.callbacksForSaveEdits = [];
  }

  get numberOfTiles () {
    const { width, height } = this.props.options;
    return width * height;
  }

  passSaveCallbacks () {
    this.props.setSaveCallback(this.getDataToSave.bind(this));
  }

  passSaveEditsCallbacks () {
    this.props.setSaveEditsCallback(this.saveEditsHandle.bind(this));
  }

  saveEditsHandle () {
    this.callbacksForSaveEdits.forEach(f => f());
  }

  getDataToSave () {
    return this.callbacksForDataToSave.map(f => f ? f() : {});
  }

  render () {
    const saveDataHandle = (callback, i) => {
      this.callbacksForDataToSave[i] = callback;

      const savedCallbacks = this.callbacksForDataToSave.reduce(
        (n, f) => n + (f ? 1 : 0),
        0
      );
      if (savedCallbacks === this.numberOfTiles) this.passSaveCallbacks();
    }; // https://stackoverflow.com/questions/37949981/call-child-method-from-parent

    const saveEditsHandle = (callback, i) => {
      this.callbacksForSaveEdits[i] = callback;

      const savedCallbacks = this.callbacksForSaveEdits.reduce(
        (n, f) => n + (f ? 1 : 0),
        0
      );
      if (savedCallbacks === this.numberOfTiles) this.passSaveEditsCallbacks();
    };

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
            setSaveCallback={saveDataHandle}
            editMode={this.props.editMode}
            setSaveEditCallback={saveEditsHandle}
            availableWidgets={this.props.availableWidgets}
            widget={widgets[i]}
            config={configs[i]}
          />)}
      </div>
    );
  }
}

export default Grid;
