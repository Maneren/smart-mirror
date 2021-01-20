import React from 'react';
import './WifiQRCode.css';
import WidgetTemplate from '../template.js';

class WifiQRCode extends WidgetTemplate {
  static get menuName () {
    return 'Wifi QR kód';
  }

  toURLEncoded (object) {
    let output = '';
    for (const key in object) {
      output += `${key}=${window.encodeURIComponent(object[key])}&`;
    }
    return output;
  }

  render () {
    const { encryption, ssid, password, hidden } = this.props.config;
    const url =
      'https://chart.googleapis.com/chart?' + this.toURLEncoded(
        {
          cht: 'qr',
          chl: `WIFI:T:${encryption};S:${ssid};P:${password};H:${hidden};`,
          chs: '180x180',
          choe: 'UTF-8',
          chld: 'L|2'
        }
      );
    return (
      <div className='qr-code-container'>
        <span className='WifiText'> QR code for {ssid}</span>
        <br />
        <img className='QrWifi' src={url} alt='wifi qr code' />
      </div>
    );
  }
}

export default WifiQRCode;
