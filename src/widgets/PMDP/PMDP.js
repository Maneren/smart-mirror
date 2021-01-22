import React from 'react';
import Loader from '../../components/Loader.js';
import WidgetTemplate from '../template.js';
import './PMDP.css';
import fetchConnectionsFromPMDP from './api.js';

class PMDP extends WidgetTemplate {
  constructor (props) {
    super(props);
    this.defaults = {
      limit: 3,
      minTimeBeforeDepart: 0
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
        type: 'number',
        id: 'minTimeBeforeDepart',
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
    this.internalClock = setInterval(this.updateState.bind(this), 60000);
  }

  updateState () {
    const { from, to, limit, minTimeBeforeDepart } = this.config;
    for (const value of [from, to, limit]) { if (!value || value === '') return; }
    const datetime = new Date(Date.now() + minTimeBeforeDepart * 60 * 1000);
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

    const formatTime = datetime => datetime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const formatMinutes = number => {
      return (number === 1 ? 'minuta' : (number => 2) && (number <= 4) ? 'minuty' : 'minut');
    };
    const formatMinutes2 = number => (number === 1) ? 'minutu' : (number => 2) && (number <= 4) ? 'minuty' : 'minut';

    if (!loaded) return <div className='pmdp-container'><Loader color='#eee' /></div>;
    return (
      <div className='pmdp-container'>
        <header>{`${from} -> ${to}`}</header>
        <div className='connections'>
          {connections.map(
            (connection, index) => (
              <div key={index} className='connection'>
                <div className='connection-header'>
                  <span className='departsIn'>za {connection.departsIn} {formatMinutes2(connection.departsIn)}</span>
                  <span className='duration'>{connection.duration} {formatMinutes(connection.duration)}</span>
                </div>
                {connection.segments.map(
                  (segment, index) => (
                    <div className='segment' key={index}>
                      <div className={`line ${segment.line.type}`}>
                        <div className='line-icon-wrapper'>
                          <img src={`http://localhost:3000/assets/pmdp/${segment.line.type}.png`} alt='line type icon' className='line-icon' />
                        </div>
                        <div>{segment.line.number}</div>
                      </div>
                      {segment.line.type !== 'walk'
                        ? (
                          <div className='from-to'>
                            <div className='from'>
                              <span className='name'>{segment.from.name}</span>
                              <span className='time'>{formatTime(segment.from.datetime)}</span>
                            </div>
                            <div className='to'>
                              <span className='name'>{segment.to.name}</span>
                              <span className='time'>{formatTime(segment.to.datetime)}</span>
                            </div>
                          </div>
                          )
                        : null}
                    </div>
                  )
                )}
              </div>
            )

          )}
        </div>
      </div>
    );
  }
}

export default PMDP;
