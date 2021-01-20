import React from 'react';
import './WifiQRCode.css';
import WidgetTemplate from '../template.js';

class WifiQRCode extends WidgetTemplate {
  static get menuName () {
    return 'Wifi QR kód';
  }

  static get configInput () {
    return [
      {
        type: 'text',
        id: 'ssid',
        label: 'Název',
        placeholder: 'Název WiFi sítě'
      },
      {
        type: 'text',
        id: 'password',
        label: 'Heslo',
        placeholder: 'Heslo WiFi sítě'
      },
      {
        type: 'select',
        id: 'encryption',
        label: 'Zabezpečení',
        options: [
          { label: 'WEP', id: 'WEP' },
          { label: 'WPA', id: 'WPA' },
          { label: 'Žádné', id: '' }
        ]
      },
      {
        type: 'bool',
        id: 'hidden',
        label: 'Skrytá'
      }
    ];
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
