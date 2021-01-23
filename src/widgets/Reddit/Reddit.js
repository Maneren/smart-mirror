import React from 'react';

import WidgetTemplate from '../template.js';

import './Reddit.css';

import Loader from '../../components/Loader';
import ImgLoader from '../../components/ImgLoader';

import Utils from '../../Utils';
const { requestWithProxy } = Utils.Network;
const { shuffle } = Utils.Array;

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

  isBadImgFormat (src) {
    if (!src) return true;
    return [/(v\.redd)/, /(gfycat)/, /(\.gif)/, /(imgur)/, /(gallery)/].some(regex => src.search(regex) !== -1);
  }

  updateState () {
    console.log('UPDATE');
    const fetchLimit = Math.ceil(this.config.preloadPosts / this.config.subreddits.length);
    const requests = this.config.subreddits.map(subreddit => {
      const query = `https://reddit.com/r/${subreddit}.json?limit=${fetchLimit}`;

      return requestWithProxy(query, {
        headers: { 'User-Agent': 'web:smart-mirror:v1 (by /u/Maneren731)' }
      });
    });

    Promise.all(requests).then(jsons => {
      let data = jsons
        .map(this.processData.bind(this))
        .reduce((total, current) => total.concat(current), [])
        .filter(post => post.title)
        .filter(post => !this.isBadImgFormat(post.src));

      if (!this.config.nsfw) data = data.filter(post => !post.nsfw);
      if (!this.config.allowSpoilers) data = data.filter(post => !post.spoiler);
      data = shuffle(data);

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

      const url = 'https://reddit.com' + postData.permalink;
      const src = postData.url_overridden_by_dest;

      const nsfw = postData.over_18;
      const spoiler = postData.spoiler;
      const score = postData.score;
      const comments = postData.num_comments;

      return {
        subreddit,
        author,
        title,
        url,
        src,
        nsfw,
        spoiler,
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

  handleImgError (error) {
    if (error.name[0] !== '4') throw error;
    clearTimeout(this.updateClock);
    this.changeImg();
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
        <a href={activePost.url} target='_blank' rel='noopener noreferrer'>
          <ImgLoader
            src={activePost.src}
            className='img'
            alt='post img'
            OnLoad={this.imgLoaded.bind(this)}
            OnError={this.handleImgError.bind(this)}
            proxy='http://127.0.0.1:3100'
          />
        </a>
        <div className='comments-score'>
          <span className='score'>
            <img src='http://localhost:3000/assets/upvote.svg' alt='upvote icon' />
            <span>{activePost.score}</span>
          </span>
          <span className='comments'>
            <img src='http://localhost:3000/assets/comments.svg' alt='comments icon' />
            <span>{activePost.comments}</span>
          </span>
        </div>
      </div>
    );
  }
}

Reddit.menuName = 'Reddit';

export default Reddit;
