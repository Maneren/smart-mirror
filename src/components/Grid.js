import React, { Component } from 'react';
import './styles/Grid.css';

import Tile from './Tile.js';

class Grid extends Component {
  render () {
    return (
      <div className='grid-container'>

        <Tile>{this.props.modules[0]}</Tile>
        <Tile>{this.props.modules[1]}</Tile>
        <Tile>{this.props.modules[2]}</Tile>
        <Tile>{this.props.modules[3]}</Tile>
        <Tile>{this.props.modules[4]}</Tile>
        <Tile>{this.props.modules[5]}</Tile>
      </div>
    );
  }
}

export default Grid;
