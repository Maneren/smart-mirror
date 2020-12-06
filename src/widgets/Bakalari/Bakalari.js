import React from 'react';

import WidgetTemplate from '../template.js';

import './Bakalari.css';

import Loader from '../../components/Loader';

// import json from './test.json';
import User from './user.js';

class Bakalari extends WidgetTemplate {
  constructor (props) {
    super(props);
    this.defaults = {
    };
    this.state = {
      config: props.config,
      user: null,
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
    const getConfigs = this.getConfigs.bind(this);

    const user = new User(...getConfigs('username', 'password', 'server'));
    user.onReady(this.updateState.bind(this));
    this.setState({ user });

    this.internalClock = setInterval(this.updateState.bind(this), 120000);
  }

  static processData (data, type) {
    switch (type) {
      case User.endpoints.ACTUAL_TIMETABLE:
        return this.processTimetable(data);
      case User.endpoints.MARKS:
        return this.processMarks(data);
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
                  blankLesson: true,
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
          lessons.splice(j, 0, {});
          break;
        }
      }
      timetable[i].lessons = lessons;
    }

    // make aal days same lenght by appending blank lessons
    const maxLength = timetable.reduce((max, current) => Math.max(max, current.lessons.length), -1);
    const toFixedLengthArr = (arr, len) => [...arr, ...(new Array(len - arr.length).fill({}))];
    timetable.map(day => { day.lessons = toFixedLengthArr(day.lessons, maxLength); });

    timetable.maxDayLength = maxLength;

    console.log(timetable);
    return timetable;
  }

  async updateState () {
    const endpoint = User.endpoints.ACTUAL_TIMETABLE;
    const json = await this.state.user.getData(endpoint /* { date: '2020-09-18' } */);
    console.log(json);
    const data = Bakalari.processData(json, endpoint);
    this.setState({ timetable: data, loaded: true });
  }

  get missingCredentials () {
    return (!this.getConfig('server') || this.getConfig('server') === '') ||
           (!this.getConfig('username') || this.getConfig('username') === '') ||
           (!this.getConfig('password') || this.getConfig('password') === '');
  }

  componentWillUnmount () {
    clearInterval(this.internalClock);
  }

  render () {
    if (this.missingCredentials) return (<div className='bakalari-container'>Missing credentials</div>);
    if (!this.state.loaded) return <div className='bakalari-container'><Loader color='#eee' /></div>;

    const timetable = this.state.timetable;
    return (
      <div className='bakalari-container'>
        <table className='timetable'>
          <thead>
            <tr className='hours'>
              <th key={0} />
              {new Array(timetable.maxDayLength).fill(0).map((x, i) => <th key={i}>{i + 1}</th>)}
            </tr>
          </thead>
          <tbody>
            {timetable.map(
              (day, i) => {
                return (
                  <tr key={i} className='day'>
                    <td className='weekday'>{day.weekday}</td>
                    {day.lessons.map(
                      (lesson, i) =>
                        lesson
                          ? (!lesson.blankLesson
                            ? (<td key={i} className={`lesson ${lesson.changed ? 'changed' : ''}`}>{lesson.subject}</td>)
                            : <td key={i} className={`lesson ${lesson.changed ? 'changed' : ''}`} />
                          ) : (<td key={i} className='lesson' />)
                    )}
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

Bakalari.menuName = 'Bakaláři';

export default Bakalari;
