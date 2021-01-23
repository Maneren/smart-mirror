import React from 'react';

import WidgetTemplate from '../template.js';

import './WeatherForecast.css';

import Loader from '../../components/Loader';

// import json from './test.json';

class WeatherForecast extends WidgetTemplate {
  constructor (props) {
    super(props);
    this.defaults = {
      url: 'https://api.openweathermap.org/data/2.5/forecast',
      apiKey: '',
      location: 'Pilsen,Czechia',
      degreeLabel: '℃'
    };
    this.state = {
      config: props.config,
      forecasts: [],
      fetchedLocationName: '',
      loaded: false
    };

    this.iconTable = {
      '01d': 'wi-day-sunny',
      '02d': 'wi-day-cloudy',
      '03d': 'wi-cloudy',
      '04d': 'wi-cloudy',
      '09d': 'wi-showers',
      '10d': 'wi-rain',
      '11d': 'wi-thunderstorm',
      '13d': 'wi-snow',
      '50d': 'wi-fog',
      '01n': 'wi-night-clear',
      '02n': 'wi-night-cloudy',
      '03n': 'wi-night-cloudy',
      '04n': 'wi-night-cloudy',
      '09n': 'wi-night-showers',
      '10n': 'wi-night-rain',
      '11n': 'wi-night-thunderstorm',
      '13n': 'wi-night-snow',
      '50n': 'wi-night-alt-cloudy-windy'
    };
  }

  static get menuName () {
    return 'Týdenní předpověď';
  }

  static get configInput () {
    return [
      {
        type: 'text',
        id: 'location',
        label: 'Místo',
        placeholder: ''
      }
    ];
  }

  getDataToSave () {
    return { type: this.constructor.name, config: { ...this.state.config, apiKey: 'OpenWeather' } };
  }

  componentDidMount () {
    super.componentDidMount();
    this.updateState();
    this.internalClock = setInterval(this.updateState.bind(this), 1200000);
  }

  updateState () {
    const { apiKey, url, location } = this.config;
    if (!apiKey || apiKey === '') return;

    // const sleep = milis => new Promise(resolve => setTimeout(resolve, milis));
    // sleep(Math.random() * 2000 + 500).then(() => {
    //   const data = this.processWeatherData(json);
    //   console.log('UPDATE');
    //   this.setState({ forecasts: data, loaded: true });
    // });

    const query = `${url}?appid=${apiKey}&q=${location}&units=metric`;

    const request = require('request-promise-native');
    request(query).then(
      response => {
        const json = JSON.parse(response);
        const data = this.processWeatherData(json);
        console.log('UPDATE');
        this.setState({ forecasts: data, loaded: true });
      }
    );
  }

  processWeatherData (data) {
    this.setState({ fetchedLocationName: `${data.city.name}, ${data.city.country}` });

    const forecasts = [];

    for (let i = 0; i < data.list.length;) {
      let f = data.list[i];
      const date = new Date(f.dt_txt);
      const dateOptions = { weekday: 'short', month: 'numeric', day: 'numeric' };
      const day = date.toLocaleDateString('cs-CZ', dateOptions);

      const forecast = {
        minTemp: 100,
        maxTemp: -100,

        rain: 0,
        icon: this.iconTable[f.weather[0].icon.replace('n', 'd')],

        day: day
      };

      if (i === data.list.length - 1) {
        continue;
      }

      for (let j = 0; j < 8; j++, i++) {
        f = data.list[i];
        const main = f.main;

        if (f.rain) forecast.rain += f.rain['3h'];

        if (main.temp > forecast.maxTemp) forecast.maxTemp = main.temp;
        if (main.temp < forecast.minTemp) forecast.minTemp = main.temp;
      }

      forecasts.push(forecast);
    }

    return forecasts;
  }

  componentWillUnmount () {
    clearInterval(this.internalClock);
  }

  render () {
    const { apiKey } = this.config;
    if (!apiKey || apiKey === '') return (<div className='weather-container'>No API key</div>);

    const degreeLabel = this.config.degreeLabel;

    const loading = <div className='weather-container'><Loader color='#eee' /></div>;
    const loaded = (
      <div className='forecast-container'>
        <header>{this.state.fetchedLocationName !== '' ? `Předpověd pro ${this.state.fetchedLocationName}` : 'Předpověd počasí'}</header>
        <table>
          <tbody>
            {this.state.forecasts.map(
              (f, i) => (
                <tr key={i} className='small'>
                  <td className='day'>{f.day}</td>
                  <td className='bright weather-icon'><span className={`wi weathericon ${f.icon}`} /></td>
                  <td className='align-right bright max-temp'>
                    <span>{f.maxTemp.toFixed(1)}</span>
                    <span className='degree'>{degreeLabel}</span>
                  </td>
                  <td className='align-right bright min-temp'>
                    <span>{f.minTemp.toFixed(1)}</span>
                    <span className='degree'>{degreeLabel}</span>
                  </td>
                  <td className='rain'>{f.rain.toFixed(1)} mm</td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    );

    return this.state.loaded ? loaded : loading;
  }
}

export default WeatherForecast;
