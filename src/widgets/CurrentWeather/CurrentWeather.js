import React from 'react';

import WidgetTemplate from '../template.js';

import './CurrentWeather.css';
import './assets/css/weather-icons.css';

import json from './test.json';

import Loader from '../../components/Loader';

class CurrentWeather extends WidgetTemplate {
  constructor (props) {
    super(props);
    this.defaults = {
      url: 'https://api.openweathermap.org/data/2.5/weather',
      apiKey: '', // cf75b04dc7e8f66b135a9f521a54affb
      location: 'Pilsen,Czechia',
      degreeLabel: '℃'
    };
    this.state = {
      config: props.config,
      loaded: false,
      weather: [],
      fetchedLocationName: ''
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

  get config () {
    return {
      ...this.defaults,
      ...this.state.config
    };
  }

  getDataToSave () {
    return { type: this.constructor.name, config: { ...this.state.config, apiKey: 'OpenWeather' } };
  }

  componentDidMount () {
    super.componentDidMount();
    this.updateState();
    this.internalClock = setInterval(this.updateState.bind(this), 120000);
  }

  updateState () {
    const { apiKey } = this.config;
    if (!apiKey || apiKey === '') return;

    const sleep = milis => new Promise(resolve => setTimeout(resolve, milis));
    sleep(Math.random() * 2000 + 500).then(() => {
      const data = this.processWeatherData(json);
      console.log('UPDATE');
      this.setState({ weather: data, loaded: true });
    });

    // const [url, location] = this.getConfigs('url', 'apiKey', 'location');
    // console.log(url, apiKey, location);
    // const query = `${url}?appid=${apiKey}&q=${location}&units=metric`;

    // const request = require('request-promise-native');
    // request(query).then(
    //   response => {
    //     const json = JSON.parse(response);
    //     console.log(response);
    //     const data = this.processWeatherData(json);
    //     this.setState({ forecasts: data, loaded: true });
    //   }
    // );
  }

  processWeatherData (data) {
    this.setState({ fetchedLocationName: `${data.name}, ${data.sys.country}` });

    const windNum = data.wind.speed;
    const wind = windNum.toFixed(1);
    const tempNum = data.main.temp;
    const temp = tempNum.toFixed(1);
    const humidity = data.main.humidity;

    let feel;
    if (windNum > 1.4 && tempNum < 10) {
      const windInKph = windNum * 3.6;
      const c1 = 13.12;
      const c2 = 0.6215;
      const c3 = -11.37;
      const c4 = 0.3965;
      const c5 = 0.16;
      // windchill
      feel = Math.round(
        c1 +
        c2 * tempNum +
        c3 * Math.pow(windInKph, c5) +
        c4 * tempNum * Math.pow(windInKph, c5)
      );
    } else if (tempNum > 27 && humidity > 40) {
      // heat index
      const c1 = -8.78469475556;
      const c2 = 1.61139411;
      const c3 = 2.33854883889;
      const c4 = -0.14611605;
      const c5 = -0.012308094;
      const c6 = -0.0164248277778;
      const c7 = 0.002211732;
      const c8 = 0.00072546;
      const c9 = -0.000003582;
      feel =
        c1 +
        c2 * tempNum +
        c3 * humidity +
        c4 * tempNum * humidity +
        c5 * tempNum * tempNum +
        c6 * humidity ** 2 +
        c7 * tempNum ** 2 * humidity +
        c8 * tempNum * humidity ** 2 +
        c9 * tempNum ** 2 * humidity ** 2;
    } else {
      feel = temp;
    }

    const weatherType = this.iconTable[data.weather[0].icon];

    const now = new Date();
    const sunrise = new Date(data.sys.sunrise * 1000);
    const sunset = new Date(data.sys.sunset * 1000);

    const sunriseSunsetDateObject = sunrise < now && sunset > now ? sunset : sunrise;

    const sunriseSunsetTime = sunriseSunsetDateObject.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', seconds: '2-digit' });
    const sunriseSunsetIcon = sunrise < now && sunset > now ? 'wi-sunset' : 'wi-sunrise';

    return {
      temp,
      wind,
      humidity,
      feel,
      weatherType,
      sunriseSunsetTime,
      sunriseSunsetIcon
    };
  }

  componentWillUnmount () {
    clearInterval(this.internalClock);
  }

  render () {
    const { apiKey } = this.config;
    if (!apiKey || apiKey === '') return (<div className='weather-container'>No API key</div>);

    const weather = this.state.weather;
    const degreeLabel = this.config.degreeLabel;

    const loading = <div className='weather-container'><Loader color='#eee' /></div>;
    const loaded = (
      <div className='weather-container'>
        <header>{this.state.fetchedLocationName}</header>
        <div className='medium'>
          <span className='wi wi-strong-wind dimmed' />
          <span>{weather.wind}</span>
          <span className='spacer'>&nbsp;</span>
          <span className='spacer'>&nbsp;</span>
          <span>{weather.humidity}</span>
          <sup className='sup-spacer'>&nbsp;</sup>
          <sup className='wi wi-humidity humidity-icon'>&nbsp;</sup>
          <span className='spacer'>&nbsp;</span>
          <span className={`wi dimmed ${weather.sunriseSunsetIcon}`} />
          <span className='spacer'>&nbsp;</span>
          <span>{weather.sunriseSunsetTime}</span>
        </div>
        <div className='large'>
          <span className={`wi weathericon ${weather.weatherType}`} />
          <span className='bright outdoor'>{weather.temp}</span>
          <span className='bright degree'>{degreeLabel}</span>
        </div>
        <div className='medium'>
          <span className='dimmed'>{`Pocit: ${weather.feel}`}</span>
          <span className='dimmed degree'>{degreeLabel}</span>
        </div>
      </div>
    );
    return this.state.loaded ? loaded : loading;
  }
}

CurrentWeather.menuName = 'Týdenní předpověď';

export default CurrentWeather;
