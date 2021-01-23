import React from 'react';
import './Youtube.css';
import WidgetTemplate from '../template';
import Loader from '../../components/Loader';
import Utils from '../../Utils';

class Youtube extends WidgetTemplate {
  constructor (props) {
    super(props);
    this.defaults = {};
    this.state = {
      config: props.config,
      loaded: false
    };
  }

  static get menuName () {
    return 'Youtube';
  }

  static get configInput () {
    return [
      {
        type: 'text',
        id: 'URL',
        label: 'URL',
        placeholder: 'URL videa'
      }
    ];
  }

  get uri () {
    const url = this.config.URL;
    if (!url) return false;
    const { domain, page, parameters } = Utils.Network.decodeURL(url);
    if (domain === 'www.youtube.com' && page === 'watch' && parameters.v.length === 11) return parameters.v;
    else return false;

    // https://www.youtube.com/watch?v=haT4Q-1_Zv4 -> haT4Q-1_Zv4
  }

  render () {
    const uri = this.uri;
    if (!uri) return <div className='spotify-container'>Invalid or missing URI</div>;
    const { loaded } = this.state;
    // https://developers.google.com/youtube/iframe_api_reference
    return (
      <div className='youtube-container'>
        {!loaded ? <Loader color='#eee' /> : null}
        <iframe
          className='yt-video'
          title='Youtube'
          width='560'
          height='315'
          src={`https://www.youtube.com/embed/${uri}`}
          frameBorder='0'
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
          allowFullScreen
          onLoad={() => this.setState({ loaded: true })}
          style={{ display: loaded ? 'block' : 'none' }}
        />
      </div>
    );
  }
}

export default Youtube;
