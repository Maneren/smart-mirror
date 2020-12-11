import React from 'react';

import WidgetTemplate from '../template.js';

import './Reddit.css';

import Loader from '../../components/Loader';
import ImgLoader from '../../components/ImgLoader';

import Utils from '../../Utils';

class Reddit extends WidgetTemplate {
  constructor (props) {
    super(props);
    this.defaults = {
      loadImages: true,
      allowNSFW: false,
      preloadPosts: 50,
      imgChangeInterval: 30
    };
    this.state = {
      config: props.config,
      posts: [],
      activePostIndex: 0
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
    this.updateState();
  }

  changeImg () {
    const currentIndex = this.state.activePostIndex;
    const loadedPosts = this.state.posts.length;

    if (currentIndex + 1 === loadedPosts) {
      this.updateState();
    }

    this.setState({
      activePostIndex: (currentIndex + 1) % loadedPosts
    });
  }

  updateState () {
    console.log('UPDATE');
    const request = require('request-promise-native');
    const fetchLimit = Math.ceil(this.config.preloadPosts / this.config.subreddits.length);
    const requests = this.config.subreddits.map(subreddit => {
      const query = 'https://cors-anywhere.herokuapp.com/' + `https://reddit.com/r/${subreddit}.json?limit=${fetchLimit}`;

      return request(query, {
        headers: { 'User-Agent': 'web:smart-mirror:v1 (by /u/Maneren731)' }
      });
    });
    Promise.all(requests).then(jsons => {
      let data = jsons
        .map(this.processData.bind(this))
        .reduce((total, current) => total.concat(current), [])
        .filter(post => post.title);
      if (!this.config.nsfw) data = data.filter(post => !post.nsfw);
      data = Utils.shuffle(data);
      this.setState({
        posts: data,
        loaded: true
      });
    });
  }

  processData (data) {
    data = JSON.parse(data);
    // console.log(data);
    return data.data.children.map((post, i) => {
      const postData = post.data;
      const isStickied = postData.stickied;
      if (isStickied) return {};
      const subreddit = postData.subreddit;
      const author = postData.author;
      const title = postData.title;

      const src = 'https://cors-anywhere.herokuapp.com/' + postData.url_overridden_by_dest;

      const nsfw = postData.over_18;
      const score = postData.score;
      const comments = postData.num_comments;

      return {
        subreddit,
        author,
        title,
        src,
        nsfw,
        score,
        comments
      };
    });
  }

  componentWillUnmount () {
    clearTimeout(this.updateClock);
  }

  get activePost () {
    return this.state.posts[this.state.activePostIndex];
  }

  imgLoaded () {
    clearTimeout(this.updateClock);
    this.updateClock = setTimeout(this.changeImg.bind(this), this.config.imgChangeInterval * 1000);
  }

  render () {
    if (!this.state.loaded) return <div className='reddit-container'><Loader color='#eee' /></div>;
    const activePost = this.activePost;
    return (
      <div className='reddit-container'>
        <div className='head'>
          <span className='subreddit'>r/{activePost.subreddit}</span>
          <span className='author'> by u/{activePost.author}</span>
          <div className='line' />
        </div>
        <div className='title'>{activePost.title}</div>
        <ImgLoader src={activePost.src} className='img' alt='post img' OnLoad={this.imgLoaded.bind(this)} />
        <div />
        <span className='score'><i className='gg-arrow-up-r' />{activePost.score}</span>
        <span className='comments'><i className='gg-comment' />{activePost.comments}</span>
      </div>
    );
  }
}

Reddit.menuName = 'Reddit';

export default Reddit;
