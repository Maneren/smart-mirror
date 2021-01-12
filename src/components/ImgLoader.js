import React from 'react';

import Loader from './Loader';

import './styles/ImgLoader.css';

const Status = {
  PENDING: 'pending',
  LOADING: 'loading',
  LOADED: 'loaded'
};

export default class ImgLoader extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      src: props.src,
      status: props.src ? Status.LOADING : Status.PENDING,
      progress: 0
    };
  }

  componentDidMount () {
    if (this.state.status === Status.LOADING) this.resolveImage();
  }

  componentDidUpdate () {
    if (this.props.src !== this.state.src) {
      this.setState({
        src: this.props.src,
        status: this.props.src ? Status.LOADING : Status.PENDING,
        progress: 0
      }, () => this.resolveImage());
    }
  }

  onError (event) {
    console.log('Error :', event);
    if (this.props.onError) this.props.onError(event);
  }

  onProgress (event) {
    const progress = parseInt(event.loaded / event.total * 100);
    this.setState({ progress });
  }

  onLoad (blob) {
    this.props.OnLoad();
    this.setState({
      blob: window.URL.createObjectURL(blob),
      status: Status.LOADED
    });
  }

  componentWillUnmount () {
    if (this.xmlHTTP) this.xmlHTTP.abort();
  }

  resolveImage () {
    // Abort prev request if active
    if (this.xmlHTTP) this.xmlHTTP.abort();

    this.xmlHTTP = new window.XMLHttpRequest();

    const src = this.props.proxy ? `${this.props.proxy}/${this.props.src}` : this.props.src;

    this.xmlHTTP.open('GET', src, true);
    this.xmlHTTP.responseType = 'arraybuffer';

    this.xmlHTTP.onerror = event => this.onError(event);
    this.xmlHTTP.onprogress = event => this.onProgress(event);
    this.xmlHTTP.onload = event => this.onLoad(new window.Blob([this.xmlHTTP.response]));

    try {
      this.xmlHTTP.send();
    } catch (error) {
      this.onError(error);
    }
  }

  render () {
    if (this.state.status === Status.LOADING) {
      return (
        <>
          <Loader color='#eee' />
          {this.state.progress ? <progress max='100' value={this.state.progress} /> : null}
        </>
      );
    }

    if (this.state.status === Status.LOADED) {
      return <img src={this.state.blob} className={this.props.className} alt={this.props.alt} onError={E => { console.log(this.props.src); }} />;
    }

    if (this.state.status === Status.PENDING) {
      return <p>Pending...</p>;
    }

    return <p>Loading...</p>;
  }
}
