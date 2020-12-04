import React, { Component } from 'react';
import './styles/Loader.css';

class Loader extends Component {
  // from https://tobiasahlin.com/spinkit/
  render () {
    const color = this.props.color ? this.props.color : '#333';
    return (
      <div className='loader-container'>
        <style>{`.sk-circle .sk-child:before { background-color: ${color}; }`}</style>
        <div className='sk-circle'>
          <div className='sk-circle1 sk-child' />
          <div className='sk-circle2 sk-child' />
          <div className='sk-circle3 sk-child' />
          <div className='sk-circle4 sk-child' />
          <div className='sk-circle5 sk-child' />
          <div className='sk-circle6 sk-child' />
          <div className='sk-circle7 sk-child' />
          <div className='sk-circle8 sk-child' />
          <div className='sk-circle9 sk-child' />
          <div className='sk-circle10 sk-child' />
          <div className='sk-circle11 sk-child' />
          <div className='sk-circle12 sk-child' />
        </div>
      </div>
    );
  }
}

export default Loader;
