import React from 'react';

import './Spotify.css';

import WidgetTemplate from '../template.js';
import Loader from '../../components/Loader';

class Spotify extends WidgetTemplate {
  constructor (props) {
    super(props);
    this.defaults = {};
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

  get uri () {
    const uri = this.config.URI;
    if (!uri) return false;
    const uriParts = uri.split(':');
    const [prefix, target, id] = uriParts;
    if (prefix === 'spotify' && target === 'playlist' && id.length === 22) return `${target}/${id}`;
    else return false;

    // spotify:playlist:37i9dQZF1DWXHwQpcoF2cC
  }

  render () {
    const uri = this.uri;
    if (!uri) return <div className='spotify-container'>Invalid or missing URI</div>;
    const { loaded } = this.state;
    return (
      <div className='spotify-container'>
        {!loaded ? <Loader color='#eee' /> : null}
        <iframe
          title='Spotify embed'
          src={`https://open.spotify.com/embed/${uri}`}
          width='300'
          height='380'
          frameBorder='0'
          allowtransparency='true'
          allow='encrypted-media'
          onLoad={() => {
            window.onerror = function (msg, url, line) {
              console.log(msg, url, line);
              // if (msg === '[IFRAME ERROR MESSAGE]') {
              //   return true;
              // } else {
              //   // do nothing
              // }
            };
            this.setState({ loaded: true });
          }}
          style={{ display: loaded ? 'block' : 'none' }}
        />
      </div>
    );
  }
}

export default Spotify;
