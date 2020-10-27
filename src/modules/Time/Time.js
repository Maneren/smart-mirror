import React, { Component } from 'react';

class Time extends Component {
  constructor (props) {
    super(props);
    this.state = { time: new Date().getTime() };
  }

  componentDidMount () {
    this.internalClock = setInterval(() => this.setState({ time: new Date().getTime() }), 1000);
  }

  componentWillUnmount () {
    clearInterval(this.internalClock);
  }

  prefixWithZeroIfNeeded (number) {
    return number < 10 ? `0${number}` : number;
  }

  formatTime (time) {
    const rawSeconds = Math.floor(time / 1000);

    const seconds = rawSeconds % 60;
    const minutes = Math.floor(rawSeconds / 60) % 60;
    const hours = Math.floor(rawSeconds / 3600) % 24;

    return `${this.prefixWithZeroIfNeeded(hours)}:${this.prefixWithZeroIfNeeded(minutes)}:${this.prefixWithZeroIfNeeded(seconds)}`;
  }

  render () {
    return (
      <p>
        {this.formatTime(this.state.time)}
      </p>
    );
  }
}

export default Time;
