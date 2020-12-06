import React from 'react';
import WidgetTemplate from '../template.js';

import './Calendar.css';

import Loader from '../../components/Loader';

import ical from 'ical';

class Calendar extends WidgetTemplate {
  constructor (props) {
    super(props);
    this.defaults = {
      url: '',
      maxEvents: 2,
      maxDaysRepeatEventsToFuture: 30
    };
    this.state = {
      config: props.config,
      loaded: false
    };
  }

  getConfig (key) {
    if (this.state.config[key] !== undefined) return this.state.config[key];
    else if (this.defaults[key] !== undefined) return this.defaults[key];
    else throw new Error('unknown config key: ' + key);
  }

  getConfigs (...keys) {
    return keys.map(key => this.getConfig(key));
  }

  componentDidMount () {
    super.componentDidMount();
    this.initialize();
    this.internalClock = setInterval(this.updateState.bind(this), 120000);
  }

  initialize () {
    this.updateState();
    this.internalClock = setInterval(this.updateState.bind(this), 120000);
  }

  processData (data) {
    const parsed = ical.parseICS(data);
    console.log(parsed);
    const now = Date.now();
    let events = Object.entries(parsed).map(([key, event]) => event).filter(e => e.type === 'VEVENT');
    events = events.map(event => {
      const start = new Date(event.start);
      const end = new Date(event.end);
      const name = event.summary;
      const description = event.description;
      const uid = event.uid;

      let repeat = false;
      let repeatRule = null;
      if (event.rrule) {
        repeat = true;
        repeatRule = event.rrule;
      }

      return {
        name,
        description,
        start,
        end,
        uid,
        repeat,
        repeatRule
      };
    });
    // events = events.filter(e => e.start > now);
    events = events.sort((a, b) => a.start.getTime() - b.start.getTime());
    // events = events.splice(0, this.getConfig('maxEvents'));
    return events;
  }

  async updateState () {
    if (!this.getConfig('url') || this.getConfig('url') === '') return;

    const sleep = milis => new Promise(resolve => setTimeout(resolve, milis));
    await sleep(Math.random() * 2000 + 500);
    console.log('UPDATE');

    const url = 'https://cors-anywhere.herokuapp.com/' + this.getConfig('url');

    const request = require('request-promise-native');
    const ical = await request(url);

    console.time('someFunction');
    const data = this.processData(ical);
    console.timeEnd('someFunction');

    console.log(data);
    this.setState({ events: data, loaded: true });
  }

  componentWillUnmount () {
    clearInterval(this.internalClock);
  }

  render () {
    if (this.getConfig('url') === '') return (<div className='calendar-container'>Missing source</div>);
    if (!this.state.loaded) {
      return (
        <div className='calendar-container'>
          <Loader color='#eee' />
        </div>
      );
    }

    return (
      <div className='calendar-container'>
        {this.state.events.map(
          (e, i) => (
            <div key={i} className='event'>
              <div>
                <span className='name'>{e.name}</span> - <span className='date'>{new Date(e.start).toLocaleDateString()}</span>
              </div>
            </div>
          )
        )}
      </div>
    );
  }
}

Calendar.menuName = 'Kalendář';

export default Calendar;
