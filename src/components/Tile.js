import React, { Component } from 'react';
import './styles/Tile.css';

class Tile extends Component {
  render () {
    const children = this.props.children;

    return (
      <div className='tile-container'>
        {children === null ? '' : children}
      </div>
    );
  }
}

export default Tile;
