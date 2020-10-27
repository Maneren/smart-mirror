import React, { Component } from 'react';
import './styles/Grid.css';

import Tile from './Tile.js';

class Grid extends Component {
  render () {
    return (
      <div className='grid-container'>
        <Tile editMode={this.props.editMode} modules={this.props.modules} />
      </div>
    );
  }
}

export default Grid;
