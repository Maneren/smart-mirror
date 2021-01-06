import React from 'react';
import request from 'request-promise-native';

import WidgetTemplate from '../template.js';

import './Spotify.css';

import Loader from '../../components/Loader';

class Spotify extends WidgetTemplate {
  constructor (props) {
    super(props);
    this.defaults = {};
    this.state = {
      config: props.config,
      token: null,
      loaded: false,
      spotifySDKReady: false
    };
  }

  get config () {
    return {
      ...this.defaults,
      ...this.state.config
    };
  }

  componentDidMount () {
    super.componentDidMount();
    // this.initialize();
  }

  // async initialize () {
  //   await this.getToken();
  //   await this.fetchPlaylist();
  // }

  // async getToken () {
  //   const { CLIENT_ID, CLIENT_SECRET } = this.config.apiKey;
  //   const url = 'https://accounts.spotify.com/api/token';
  //   const options = {
  //     url,
  //     headers: {
  //       'Content-Type': 'application/x-www-form-urlencoded',
  //       Authorization: 'Basic ' + window.btoa(CLIENT_ID + ':' + CLIENT_SECRET)
  //     },
  //     body: 'grant_type=client_credentials',
  //     method: 'POST'
  //   };

  //   const response = JSON.parse(await request(options));
  //   await this.setState({ token: response.access_token });
  // }

  // async fetchPlaylist () {
  //   if (!this.isValidURI) return;
  //   const uriParts = this.config.playlistURI.split(':');
  //   const id = uriParts[2];
  //   const url = `https://api.spotify.com/v1/playlists/${id}/tracks?limit=10`;
  //   const options = {
  //     url,
  //     method: 'GET',
  //     headers: {
  //       Authorization: 'Bearer ' + this.state.token
  //     }
  //   };

  //   const response = JSON.parse(await request(options));
  //   await this.setState({ songs: response });
  // }

  // isValidURI () {
  //   const uri = this.config.playlistURI;
  //   if (!uri) return false;
  //   const uriParts = uri.split(':');
  //   const [prefix, target, id] = uriParts;
  //   return prefix === 'spotify' && target === 'playlist' && id.length === 22;
  //   // spotify:playlist:37i9dQZF1DWXHwQpcoF2cC
  // }

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
    return (
      <div className='spotify-container'>
        <iframe
          title='Spotify embed'
          src={`https://open.spotify.com/embed/${uri}`}
          width='300'
          height='380'
          frameBorder='0'
          allowtransparency='true'
          allow='encrypted-media'
        />
      </div>
    );
  }
}

export default Spotify;
