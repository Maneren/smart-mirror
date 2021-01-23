import React from 'react';
import WidgetTemplate from '../template.js';

import './Calendar.css';

import Loader from '../../components/Loader';

import ical from 'ical';
import Utils from '../../Utils';
const { requestWithProxy } = Utils.Network;

class Calendar extends WidgetTemplate {
  constructor (props) {
    super(props);
    this.defaults = {
      url: '',
      maxEvents: 5,
      maxDaysRepeatEventsToFuture: 60
    };
    this.state = {
      config: props.config,
      loaded: false
    };
  }

  static get menuName () {
    return 'Kalendář';
  }

  static get configInput () {
    return [];
  }

  getDataToSave () {
    return { type: this.constructor.name, config: this.state.config };
  }

  componentDidMount () {
    super.componentDidMount();
    this.updateState();
    this.internalClock = setInterval(this.updateState.bind(this), 180000);
  }

  processData (data) {
    const parsed = ical.parseICS(data);
    // console.log(parsed);
    const now = new Date(Date.now());
    // const now = new Date(Date.UTC(2020, 8, 15));
    let events = Object.entries(parsed).map(([key, event]) => event).filter(e => e.type === 'VEVENT');
    events = events.map(event => {
      const start = new Date(event.start);
      const end = new Date(event.end);
      const length = end - start;
      const name = event.summary;
      const description = event.description;
      const uid = event.uid;

      const isWholeDay = (
        start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) === '00:00:00' &&
        length % 86400000 === 0
      );

      const isToday = now.toDateString() === event.start.toDateString();

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
        length,
        uid,
        isWholeDay,
        isToday,
        repeat,
        repeatRule
      };
    });

    const len = events.length;
    const maxFuture = new Date(now.getTime() + (this.config.maxDaysRepeatEventsToFuture * 24 * 60 * 60 * 1000));
    for (let i = 0; i < len; i++) {
      const event = events[i];
      if (event.repeat) {
        // console.log(event);
        const newEvents = [...event.repeatRule
          .between(now, maxFuture)
          .splice(0, this.config.maxEvents)
          .map(date => {
            const newEvent = { ...event };
            newEvent.start = date;
            newEvent.end = new Date(date.getTime() + event.length);
            return newEvent;
          })];
        events.push(...newEvents);
      }
    }

    return events
      .filter(e => e.start.getTime() > now.getTime())
      .sort((a, b) => a.start.getTime() - b.start.getTime())
      .splice(0, this.config.maxEvents);
  }

  async updateState () {
    const { url } = this.config;
    if (!url || url === '') return;

    const sleep = milis => new Promise(resolve => setTimeout(resolve, milis));
    await sleep(Math.random() * 2000 + 500);
    console.log('UPDATE');

    const ical = await requestWithProxy(url);

    const data = this.processData(ical);

    // console.log(data);
    this.setState({ events: data, loaded: true });
  }

  componentWillUnmount () {
    clearInterval(this.internalClock);
  }

  render () {
    if (this.config.url === '') return (<div className='calendar-container'>Missing source URL</div>);

    if (!this.state.loaded) {
      return (
        <div className='calendar-container'>
          <Loader color='#eee' />
        </div>
      );
    }

    return (
      <div className='calendar-container'>
        <table>
          <tbody>
            {this.state.events.map(
              (e, i) => {
                const start = new Date(e.start);
                return (
                  <tr key={i} className='event'>
                    <td className='datetime'>
                      <span className='date'>{start.toLocaleDateString('cs-CZ', { month: 'long', day: 'numeric' })}</span>
                      <span className='time'>{e.isWholeDay ? 'celodenní' : start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </td>
                    <td className='name'>{e.name}</td>

                  </tr>
                );
              }
            )}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Calendar;
