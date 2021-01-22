import React from 'react';
import Loader from '../../components/Loader.js';
import WidgetTemplate from '../template.js';
import './PMDP.css';
import fetchConnectionsFromPMDP from './api.js';

class PMDP extends WidgetTemplate {
  constructor (props) {
    super(props);
    this.defaults = {
      limit: 3
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
      }
    ];
  }

  getDataToSave () {
    return { type: this.constructor.name, config: this.state.config };
  }

  componentDidMount () {
    super.componentDidMount();
    this.updateState();
    // this.internalClock = setInterval(this.updateState.bind(this), 60000);
  }

  updateState () {
    const { from, to, limit } = this.config;
    for (const value of [from, to, limit]) { if (!value || value === '') return; }
    const datetime = new Date(/* '2021-01-25T12:00:00' */Date.now());
    fetchConnectionsFromPMDP(from, to, datetime, limit)
      .then(data => {
        if (data.length > 0) {
          const timeout = data[0].start - Date.now();
          this.internalClock = setTimeout(() => this.updateState(), timeout);
        }
        this.setState({ connections: data, loaded: true });
      });
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

    const formatTime = datetime => datetime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

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
                        <div className='line'>
                          <span className={`line-type ${segment.line.type}`} />
                          <span>{segment.line.number}</span>
                        </div>
                        <div className='from'>{segment.from.name} {formatTime(segment.from.datetime)}</div>
                        <div className='to'>{segment.to.name} {formatTime(segment.to.datetime)}</div>
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
