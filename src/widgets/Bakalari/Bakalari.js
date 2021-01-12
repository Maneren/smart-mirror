import React from 'react';

import WidgetTemplate from '../template.js';

import './Bakalari.css';

import Loader from '../../components/Loader';

import User from './user.js';
import Utils from '../../Utils.js';

class Bakalari extends WidgetTemplate {
  constructor (props) {
    super(props);
    this.defaults = {
      maxErrors: 5,
      errorTimeout: 2000
    };
    this.state = {
      config: props.config,
      user: null,
      loaded: false,
      errorCount: 0
    };
  }

  static get menuName () { return 'Bakaláři'; }

  get config () {
    return {
      ...this.defaults,
      ...this.state.config
    };
  }

  getDataToSave () {
    return { type: this.constructor.name, config: { ...this.state.config, credentials: 'Bakalari' } };
  }

  componentDidMount () {
    super.componentDidMount();
    this.initialize();
  }

  initialize () {
    const { username, password, server } = this.config.credentials;
    const user = new User(username, password, server);
    user.onReady(this.updateState.bind(this));
    this.setState({ user });
  }

  static processData (json, type) {
    const data = JSON.parse(json);
    switch (type) {
      case User.endpoints.ACTUAL_TIMETABLE:
        return this.processTimetable(data);
      case User.endpoints.MARKS:
        return this.processMarks(data);
      default:
        throw new Error('Unknown endpoint');
    }
  }

  static processMarks (data) {
    return data;
  }

  static processTimetable (data) {
    const timetable = data.Days.map(
      day => {
        const weekday = new Date(day.Date).toLocaleString('cs-CZ', { weekday: 'long' });

        const lessons = day.Atoms.map(lesson => {
          const changed = lesson.Change !== null;
          const index = parseInt(data.Hours.find(e => e.Id === lesson.HourId).Caption);
          if (changed) {
            const change = lesson.Change;

            switch (change.ChangeType) {
              case 'Removed':
              case 'Canceled':
                return {
                  changed,
                  blank: true,
                  index,
                  changeType: change.ChangeType,
                  changeDescription: change.Description
                };
              default:
                break;
            }
          }
          const subject = data.Subjects.find(e => e.Id === lesson.SubjectId).Abbrev;
          const teacher = data.Teachers.find(e => e.Id === lesson.TeacherId).Abbrev;
          const room = data.Rooms.find(e => e.Id === lesson.RoomId).Abbrev;
          // const group = data.Groups.find(e => e.Id === lesson.GroupId).Abbrev;

          return {
            subject,
            index,
            teacher,
            room,
            changed
          };
        });

        return {
          weekday,
          lessons,
          lessonsCount: lessons.length
        };
      }
    );

    for (let i = 0; i < timetable.length; i++) {
      const lessons = timetable[i].lessons;
      for (let j = 0; j < lessons.length; j++) {
        const lesson = lessons[j];
        if (lesson.index !== j + 1) {
          lessons.splice(j, 0, { blank: true });
          break;
        }
      }
      timetable[i].lessons = lessons;
    }

    // make all days same lenght by appending blank lessons
    const maxLength = timetable.reduce((max, current) => Math.max(max, current.lessons.length), 0);
    const { toFixedLengthArr } = Utils.Array;
    timetable.map(day => { day.lessons = toFixedLengthArr(day.lessons, maxLength, _ => { return { blank: true }; }); return null; });
    timetable.maxDayLength = maxLength;

    // console.log(timetable);
    return timetable;
  }

  async updateState () {
    if (this.state.errorCount > this.config.maxErrors) return;
    console.log('UPDATE');
    const endpoint = User.endpoints.ACTUAL_TIMETABLE;
    try {
      const json = await this.state.user.getData(endpoint /* ,{ date: '2020-09-18' } */);
      // console.log(json);

      const data = Bakalari.processData(json, endpoint);
      this.setState({ timetable: data, loaded: true, errorCount: 0 });

      this.internalClock = setTimeout(this.updateState.bind(this), 120000);
    } catch (error) {
      if (error.name === 'StatusCodeError') {
        console.error('FetchError, attempting to reauthorize');
        this.state.user.getToken();

        const { errorCount } = this.state;
        this.setState({ errorCount: errorCount + 1 });

        this.internalClock = setTimeout(this.updateState.bind(this), this.config.errorTimeout);
      } else throw error;
    }
  }

  get missingCredentials () {
    const { server, username, password } = this.config.credentials;
    return (!server || server === '') ||
           (!username || username === '') ||
           (!password || password === '');
  }

  componentWillUnmount () {
    clearTimeout(this.internalClock);
  }

  render () {
    if (this.missingCredentials) return (<div className='bakalari-container'>Missing credentials</div>);
    if (this.state.errorCount > this.config.maxErrors) return (<div className='bakalari-container'>Connection error</div>);
    if (!this.state.loaded) return <div className='bakalari-container'><Loader color='#eee' /></div>;

    const getLessonJSX = (lesson, i) => {
      if (!lesson.blank) {
        return (
          <td key={i} className={`lesson ${lesson.changed ? 'changed' : ''}`}>
            <div>
              <span className='subject'>{lesson.subject}</span>
              <span className='room'>{lesson.room}</span>
            </div>
          </td>
        );
      }
      if (lesson.changed) return <td key={i} className='lesson changed blank' />;
      else return (<td key={i} className='lesson blank' />);
    };

    const { mapRng, range } = Utils.General;
    const timetable = this.state.timetable;
    return (
      <div className='bakalari-container'>
        <table className='timetable'>
          <thead>
            <tr className='hours'>
              <th key={0} />
              {mapRng(range(1, timetable.maxDayLength + 1), i => <th key={i}>{i}</th>)}
            </tr>
          </thead>
          <tbody>
            {timetable.map(
              (day, i) => {
                return (
                  <tr key={i} className='day'>
                    <td className='weekday'>{day.weekday}</td>
                    {day.lessons.map((lesson, i) => getLessonJSX(lesson, i))}
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

export default Bakalari;
