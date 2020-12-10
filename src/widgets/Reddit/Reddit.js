import React from 'react';

import WidgetTemplate from '../template.js';

import './Reddit.css';

import Loader from '../../components/Loader';

import json from './test.json';

class Reddit extends WidgetTemplate {
  constructor (props) {
    super(props);
    this.defaults = {
      // subreddits: ['memes'],
      loadImages: true,
      allowNSFW: false
    };
    this.state = {
      config: props.config,
      posts: [],
      activePostIndex: 7
    };
  }

  getConfig (key) {
    if (this.state.config[key] !== undefined) return this.state.config[key];
    else if (this.defaults[key] !== undefined) return this.defaults[key];
    else throw new Error('unknown key');
  }

  getConfigs (...keys) {
    return keys.map(key => this.getConfig(key));
  }

  componentDidMount () {
    super.componentDidMount();
    this.updateState();
    this.updateClock = setInterval(this.updateState.bind(this), 10000000);
  }

  updateState () {
    const sleep = milis => new Promise(resolve => setTimeout(resolve, milis));
    sleep(Math.random() * 2000 + 500).then(() => {
      const data = this.processData(json);
      console.log(data);
      this.setState({
        posts: data,
        loaded: true,
        activePost: data[this.state.activePostIndex]
      });
    });
  }

  processData (data) {
    return data.data.children.map((post, i) => {
      const postData = post.data;
      const subreddit = postData.subreddit;
      const author = postData.author;
      const title = postData.title;

      const img = new window.Image();
      const src = postData.url_overridden_by_dest;
      img.src = src;
      if (i === this.state.activePostIndex) {
        img.onload = function (e) {
          e.target.loaded = true;
          this.forceUpdate();
        }.bind(this);
      } else {
        img.onload = e => {
          e.target.loaded = true;
        };
      }
      const image = { img, src };

      const nsfw = postData.over_18;
      const score = postData.score;
      const comments = postData.num_comments;

      return {
        subreddit,
        author,
        title,
        image,
        nsfw,
        score,
        comments
      };
    });
  }

  // fetchImgWithCustomHeader (url) {
  //   const request = require('request-promise-native');

  //   const options = {
  //     url: encodeURI('https://cors-anywhere.herokuapp.com/' + url),
  //     headers: {
  //       'User-Agent': 'web:smart-mirror:v1 (by /u/Maneren731)'
  //     },
  //     encoding: null
  //   };

  //   return request(options).then(
  //     response => {
  //       const blob = new window.Blob(response, { type: 'image/jpg' });
  //       const imageUrl = URL.createObjectURL(blob);
  //       console.log(blob);
  //     }
  //   );
  // }

  componentWillUnmount () {
    clearInterval(this.updateClock);
  }

  render () {
    if (!this.state.loaded) return <div className='reddit-container'><Loader color='#eee' /></div>;
    const activePost = this.state.activePost;
    const imgLoaded = activePost.image.img;
    return (
      <div className='reddit-container'>
        <div className='head'>
        <span className='subreddit'>r/{activePost.subreddit}</span>
        <span className='author'> by u/{activePost.author}</span>
        <div className='line'></div>
        </div>
        <div className='title'>{activePost.title}</div>
        <img src={activePost.image.src} className='img' alt='post img' />
        <div></div>
        <span className='score'><i class="gg-arrow-up-r"></i>{activePost.score}</span>
        <span className='comments'><i class="gg-comment"></i>{activePost.comments}</span>
      </div>
    );
  }
}

Reddit.menuName = 'Hodiny';

export default Reddit;
