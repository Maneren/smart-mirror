import React from 'react';
import WidgetTemplate from '../template.js';

import './Calendar.css';

import Loader from '../../components/Loader';

import ical from 'ical';
// import moment from 'moment';

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

  get config () {
    return {
      ...this.defaults,
      ...this.state.config
    };
  }

  // getConfig (key) {
  //   if (this.state.config[key] !== undefined) return this.state.config[key];
  //   else if (this.defaults[key] !== undefined) return this.defaults[key];
  //   else throw new Error('unknown config key: ' + key);
  // }

  // getConfigs (...keys) {
  //   return keys.map(key => this.getConfig(key));
  // }

  componentDidMount () {
    super.componentDidMount();
    this.initialize();
  }

  initialize () {
    this.updateState();
    this.internalClock = setInterval(this.updateState.bind(this), 180000);
  }

  processData (data) {
    // const eventDate = function (event, time) {
    //   return event[time].length === 8 ? moment(event[time], 'YYYYMMDD') : moment(new Date(event[time]));
    // };

    // const getTitleFromEvent = function (event) {
    //   let title = 'Event';
    //   if (event.summary) {
    //     title = typeof event.summary.val !== 'undefined' ? event.summary.val : event.summary;
    //   } else if (event.description) {
    //     title = event.description;
    //   }

    //   return title;
    // };

    // const limitFunction = function (date, i) {
    //   return true;
    // };

    // const timeFilterApplies = function (now, endDate, filter) {
    //   if (filter) {
    //     const until = filter.split(' ');
    //     const value = parseInt(until[0]);
    //     const increment = until[1].slice(-1) === 's' ? until[1] : until[1] + 's'; // Massage the data for moment js
    //     const filterUntil = moment(endDate.format()).subtract(value, increment);

    //     return now < filterUntil.format('x');
    //   }

    //   return false;
    // };

    // const isFullDayEvent = function (event) {
    //   if (event.start.length === 8 || event.start.dateOnly) {
    //     return true;
    //   }

    //   const start = event.start || 0;
    //   const startDate = new Date(start);
    //   const end = event.end || 0;
    //   if ((end - start) % (24 * 60 * 60 * 1000) === 0 && startDate.getHours() === 0 && startDate.getMinutes() === 0) {
    //     // Is 24 hours, and starts on the middle of the night.
    //     return true;
    //   }

    //   return false;
    // };

    // const parsed = ical.parseICS(data);
    // // console.log(parsed);
    // const now = Date.now();
    // let events = Object.entries(parsed).map(([key, event]) => {
    //   const today = moment().startOf('day').toDate();

    //   // Subtract 1 second so that events that start on the middle of the night will not repeat.
    //   const future = moment().startOf('day').add(this.config.maxDaysRepeatEventsToFuture, 'days').subtract(1, 'seconds').toDate();
    //   const past = today;

    //   // FIXME: Ugly fix to solve the facebook birthday issue.
    //   // Otherwise, the recurring events only show the birthday for next year.
    //   let isFacebookBirthday = false;
    //   if (typeof event.uid !== 'undefined') {
    //     if (event.uid.indexOf('@facebook.com') !== -1) {
    //       isFacebookBirthday = true;
    //     }
    //   }

    //   if (event.type === 'VEVENT') {
    //     let startDate = eventDate(event, 'start');
    //     let endDate;

    //     if (typeof event.end !== 'undefined') {
    //       endDate = eventDate(event, 'end');
    //     } else if (typeof event.duration !== 'undefined') {
    //       endDate = startDate.clone().add(moment.duration(event.duration));
    //     } else {
    //       if (!isFacebookBirthday) {
    //         endDate = startDate;
    //       } else {
    //         endDate = moment(startDate).add(1, 'days');
    //       }
    //     }

    //     // calculate the duration of the event for use with recurring events.
    //     let duration = parseInt(endDate.format('x')) - parseInt(startDate.format('x'));

    //     if (event.start.length === 8) {
    //       startDate = startDate.startOf('day');
    //     }

    //     const title = getTitleFromEvent(event);

    //     const excluded = false;
    //     const dateFilter = null;

    //     /* for (const f in excludedEvents) {
    //       let filter = excludedEvents[f];
    //       let testTitle = title.toLowerCase();
    //       let until = null;
    //       let useRegex = false;
    //       let regexFlags = 'g';

    //       if (filter instanceof Object) {
    //         if (typeof filter.until !== 'undefined') {
    //           until = filter.until;
    //         }

    //         if (typeof filter.regex !== 'undefined') {
    //           useRegex = filter.regex;
    //         }

    //         // If additional advanced filtering is added in, this section
    //         // must remain last as we overwrite the filter object with the
    //         // filterBy string
    //         if (filter.caseSensitive) {
    //           filter = filter.filterBy;
    //           testTitle = title;
    //         } else if (useRegex) {
    //           filter = filter.filterBy;
    //           testTitle = title;
    //           regexFlags += 'i';
    //         } else {
    //           filter = filter.filterBy.toLowerCase();
    //         }
    //       } else {
    //         filter = filter.toLowerCase();
    //       }

    //       if (testTitleByFilter(testTitle, filter, useRegex, regexFlags)) {
    //         if (until) {
    //           dateFilter = until;
    //         } else {
    //           excluded = true;
    //         }
    //         break;
    //       }
    //     }

    //     if (excluded) {
    //       return;
    //     } */

    //     const location = event.location || false;
    //     const geo = event.geo || false;
    //     const description = event.description || false;

    //     if (typeof event.rrule !== 'undefined' && event.rrule !== null && !isFacebookBirthday) {
    //       const rule = event.rrule;
    //       let addedEvents = 0;

    //       const pastMoment = moment(past);
    //       const futureMoment = moment(future);

    //       // can cause problems with e.g. birthdays before 1900
    //       if ((rule.options && rule.origOptions && rule.origOptions.dtstart && rule.origOptions.dtstart.getFullYear() < 1900) || (rule.options && rule.options.dtstart && rule.options.dtstart.getFullYear() < 1900)) {
    //         rule.origOptions.dtstart.setYear(1900);
    //         rule.options.dtstart.setYear(1900);
    //       }

    //       const pastLocal = pastMoment.subtract(past.getTimezoneOffset(), 'minutes').toDate();
    //       const futureLocal = futureMoment.subtract(future.getTimezoneOffset(), 'minutes').toDate();
    //       const datesLocal = rule.between(pastLocal, futureLocal, true, limitFunction);
    //       const dates = datesLocal.map(function (dateLocal) {
    //         return moment(dateLocal).add(dateLocal.getTimezoneOffset(), 'minutes').toDate();
    //       });

    //       // The "dates" array contains the set of dates within our desired date range range that are valid
    //       // for the recurrence rule. *However*, it's possible for us to have a specific recurrence that
    //       // had its date changed from outside the range to inside the range.  For the time being,
    //       // we'll handle this by adding *all* recurrence entries into the set of dates that we check,
    //       // because the logic below will filter out any recurrences that don't actually belong within
    //       // our display range.
    //       // Would be great if there was a better way to handle this.
    //       if (event.recurrences !== undefined) {
    //         for (const r in event.recurrences) {
    //           // Only add dates that weren't already in the range we added from the rrule so that
    //           // we don"t double-add those events.
    //           if (moment(new Date(r)).isBetween(pastMoment, futureMoment) !== true) {
    //             dates.push(new Date(r));
    //           }
    //         }
    //       }

    //       // Loop through the set of date entries to see which recurrences should be added to our event list.
    //       for (const d in dates) {
    //         const date = dates[d];
    //         // ical.js started returning recurrences and exdates as ISOStrings without time information.
    //         // .toISOString().substring(0,10) is the method they use to calculate keys, so we'll do the same
    //         // (see https://github.com/peterbraden/ical.js/pull/84 )
    //         const dateKey = date.toISOString().substring(0, 10);
    //         let curEvent = event;
    //         let showRecurrence = true;

    //         startDate = moment(date);

    //         // For each date that we're checking, it's possible that there is a recurrence override for that one day.
    //         if (curEvent.recurrences !== undefined && curEvent.recurrences[dateKey] !== undefined) {
    //           // We found an override, so for this recurrence, use a potentially different title, start date, and duration.
    //           curEvent = curEvent.recurrences[dateKey];
    //           startDate = moment(curEvent.start);
    //           duration = parseInt(moment(curEvent.end).format('x')) - parseInt(startDate.format('x'));
    //         }
    //         // If there's no recurrence override, check for an exception date.  Exception dates represent exceptions to the rule.
    //         else if (curEvent.exdate !== undefined && curEvent.exdate[dateKey] !== undefined) {
    //           // This date is an exception date, which means we should skip it in the recurrence pattern.
    //           showRecurrence = false;
    //         }

    //         endDate = moment(parseInt(startDate.format('x')) + duration, 'x');
    //         if (startDate.format('x') === endDate.format('x')) {
    //           endDate = endDate.endOf('day');
    //         }

    //         const recurrenceTitle = getTitleFromEvent(curEvent);

    //         // If this recurrence ends before the start of the date range, or starts after the end of the date range, don"t add
    //         // it to the event list.
    //         if (endDate.isBefore(past) || startDate.isAfter(future)) {
    //           showRecurrence = false;
    //         }

    //         if (timeFilterApplies(now, endDate, dateFilter)) {
    //           showRecurrence = false;
    //         }

    //         if (showRecurrence) {
    //           addedEvents++;
    //           return {
    //             title: recurrenceTitle,
    //             startDate: startDate.format('x'),
    //             endDate: endDate.format('x'),
    //             fullDayEvent: isFullDayEvent(event),
    //             class: event.class,
    //             firstYear: event.start.getFullYear(),
    //             location: location,
    //             geo: geo,
    //             description: description
    //           };
    //         }
    //       }
    //       // end recurring event parsing
    //     } else {
    //       // Single event.
    //       const fullDayEvent = isFacebookBirthday ? true : isFullDayEvent(event);

    //       // It's not a fullday event, and it is in the past, so skip.
    //       if (!fullDayEvent && endDate < new Date()) {
    //         return;
    //       }

    //       // It's a fullday event, and it is before today, So skip.
    //       if (fullDayEvent && endDate <= today) {
    //         return;
    //       }

    //       // It exceeds the this.config.maxDaysRepeatEventsToFuture limit, so skip.
    //       if (startDate > future) {
    //         return;
    //       }

    //       if (timeFilterApplies(now, endDate, dateFilter)) {
    //         return;
    //       }

    //       // Adjust start date so multiple day events will be displayed as happening today even though they started some days ago already
    //       if (fullDayEvent && startDate <= today) {
    //         startDate = moment(today);
    //       }

    //       // Everything is good. Add it to the list.
    //       return {
    //         title,
    //         startDate: startDate.format('x'),
    //         endDate: endDate.format('x'),
    //         fullDayEvent,
    //         class: event.class,
    //         location,
    //         geo,
    //         description
    //       };
    //     }
    //   }
    // });
    // events = events.filter(e => e !== undefined);
    // events = events.sort((a, b) => a.startDate - b.startDate);

    // console.log(events);

    const parsed = ical.parseICS(data);
    console.log(parsed);
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
        const rule = event.repeatRule;
        console.log(event);
        const newEvents = [...rule.between(now, maxFuture).splice(0, this.config.maxEvents)
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

  static addEllipsisIfNeeded (string, maxLength = 10) {
    if (string.length >= maxLength) return string.split('').slice(0, maxLength - 3).join('') + '...';
    else return string;
  }

  async updateState () {
    if (!this.config.url || this.config.url === '') return;

    const sleep = milis => new Promise(resolve => setTimeout(resolve, milis));
    await sleep(Math.random() * 2000 + 500);
    console.log('UPDATE');

    const url = 'https://cors-anywhere.herokuapp.com/' + this.config.url;

    const request = require('request-promise-native');
    const ical = await request(url);

    console.time('proccessing');
    const data = this.processData(ical);
    console.timeEnd('proccessing');

    console.log(data);
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
                    <td className='name'>{Calendar.addEllipsisIfNeeded(e.name, 15)}</td>
                    <td className='date'>{start.toLocaleDateString('cs-CZ', { month: 'long', day: 'numeric' })}</td>
                    <td className='time'>{start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
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

Calendar.menuName = 'Kalendář';

export default Calendar;
