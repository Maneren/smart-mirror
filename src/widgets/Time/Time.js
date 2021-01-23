import React from 'react';

import WidgetTemplate from '../template.js';

import './Time.css';

class Time extends WidgetTemplate {
  constructor (props) {
    super(props);
    this.defaults = {
      showSeconds: true,
      type: 'digital'
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
      },
      {
        type: 'select',
        id: 'type',
        label: 'Motiv',
        options: [
          { label: 'Analogové', id: 'analog' },
          { label: 'Digitální', id: 'digital' }
        ]
      }
    ];
  }

  componentDidMount () {
    super.componentDidMount();
    this.updateState();
    this.internalClock = setInterval(this.updateState.bind(this), 1000);
  }

  updateState () {
    const now = new Date();

    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    const dateOptions = { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric' };

    this.setState({
      time: {
        seconds,
        minutes,
        hours
      },
      date: now.toLocaleDateString('cs-CZ', dateOptions).replace(/(\. )/g, '.')
    });
  }

  componentWillUnmount () {
    clearInterval(this.internalClock);
  }

  render () {
    const { hours, minutes, seconds } = this.state.time;
    const { type, showSeconds } = this.config;
    if (type === 'digital') {
      return (
        <div className='time-container'>
          <p className='time large'>
            {hours}:{minutes}{showSeconds ? <sup>{seconds}</sup> : ''}
          </p>
          <p className='date medium'>
            {this.state.date}
          </p>
        </div>
      );
    } else {
      const degS = ((seconds + minutes * 60 + hours * 3600) / 60) * 360;
      const degM = ((minutes + hours * 60) / 60) * 360;
      const degH = ((minutes / 60 + hours) / 12) * 360;

      const rotate = deg => { return { transform: `rotate(${deg}deg)` }; };

      return (
        <div className='time-container'>
          <div className='analog-clock'>
            <div className='hand hour' style={rotate(degH)} />
            <div className='hand minute' style={rotate(degM)} />
            {showSeconds ? <div className='hand second' style={rotate(degS)} /> : null}
          </div>
          <p className='date medium analog'>
            {this.state.date}
          </p>
        </div>
      );
    }
  }
}

export default Time;
