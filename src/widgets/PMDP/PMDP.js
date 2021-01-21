import React from 'react';
import Loader from '../../components/Loader.js';
import WidgetTemplate from '../template.js';

import fetchConnectionsFromPMDP from './api.js';

class PMDP extends WidgetTemplate {
  constructor (props) {
    super(props);
    this.defaults = {
      limit: 5
    };
    this.state = {
      config: props.config,
      loaded: false,
      connections: []
    };
  }

  get config () {
    return {
      ...this.defaults,
      ...this.state.config
    };
  }

  static get menuName () {
    return 'Spojení PMDP';
  }

  static get configInput () {
    return [
      {
        type: 'text',
        id: 'from',
        label: 'Odkud',
        placeholder: ''
      },
      {
        type: 'text',
        id: 'to',
        label: 'Kam',
        placeholder: ''
      },
      {
        type: 'date',
        id: 'date',
        label: 'Datum'
      },
      {
        type: 'time',
        id: 'time',
        label: 'Čas'
      }
    ];
  }

  getDataToSave () {
    return { type: this.constructor.name, config: this.state.config };
  }

  componentDidMount () {
    super.componentDidMount();
    this.updateState();
    this.internalClock = setInterval(this.updateState.bind(this), 60000);
  }

  updateState () {
    const { from, to, limit } = this.config;
    for (const value of [from, to, limit]) { if (!value || value === '') return; }
    const datetime = new Date('2021-01-22T12:00:00'/* Date.now() */);
    fetchConnectionsFromPMDP(from, to, datetime, limit)
      .then(data => this.setState({ connections: data, loaded: true }));
  }

  componentWillUnmount () {
    clearInterval(this.internalClock);
  }

  render () {
    const { from, to, limit } = this.config;
    for (const value of [from, to, limit]) {
      if (!value || value === '') return (<div className='pmdp-container'>Invalid configuration</div>);
    }

    const { connections, loaded } = this.state;

    const toHoursAndMinutes = datetime => `${datetime.getHours()}:${datetime.getMinutes()}`;

    if (!loaded) return <div className='pmdp-container'><Loader color='#eee' /></div>;
    return (
      <div className='pmdp-container'>
        <header>{`${from} -> ${to}`}</header>
        <div className='connections'>
          {connections.map(
            (connection, index) => {
              return (
                <div key={index} className='connection'>
                  <div className='connection-header'>
                    <span className='duration'>{connection.duration} minut</span>
                    <span className='departsIn'>{connection.departsIn}</span>
                  </div>
                  {connection.segments.map(
                    (segment, index) => (
                      <div className='segment' key={index}>
                        <div className='line'>{segment.line.type} {segment.line.number}</div>
                        <div className='from'>{segment.from.name} {toHoursAndMinutes(segment.from.datetime)}</div>
                        <div className='to'>{segment.to.name} {toHoursAndMinutes(segment.to.datetime)}</div>
                      </div>
                    )
                  )}
                </div>
              );
            }
          )}
        </div>
      </div>
    );
  }
}

export default PMDP;
