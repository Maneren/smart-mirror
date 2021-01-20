import React from 'react';

import WidgetTemplate from '../template.js';

import './Time.css';

class Time extends WidgetTemplate {
  constructor (props) {
    super(props);
    this.defaults = {
      showSeconds: false
    };
    this.state = {
      config: props.config,
      time: {
        hours: 0,
        minutes: 0,
        seconds: 0
      },
      date: null
    };
  }

  static get menuName () {
    return 'Čas';
  }

  static get configInput () {
    return [
      {
        type: 'bool',
        id: 'showSeconds',
        label: 'Ukazovat sekundy'
      }
    ];
  }

  get config () {
    return {
      ...this.defaults,
      ...this.state.config
    };
  }

  componentDidMount () {
    super.componentDidMount();
    this.updateState();
    this.internalClock = setInterval(this.updateState.bind(this), 1000);
  }

  updateState () {
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', { hour12: false }).split(':');

    const dateOptions = { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric' };

    this.setState({
      time: {
        seconds: time[2],
        minutes: time[1],
        hours: time[0]
      },
      date: now.toLocaleDateString('cs-CZ', dateOptions).replace(/(\. )/g, '.')
    });
  }

  componentWillUnmount () {
    clearInterval(this.internalClock);
  }

  render () {
    const time = this.state.time;
    return (
      <div className='time-container'>
        <p className='time large'>
          {time.hours}:{time.minutes}{this.config.showSeconds ? <sup>{time.seconds}</sup> : ''}
        </p>
        <p className='date medium'>
          {this.state.date}
        </p>
      </div>
    );
  }
}

export default Time;
