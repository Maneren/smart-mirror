import React from 'react';
import WidgetTemplate from '../template';

class Youtube extends WidgetTemplate {
  constructor (props) {
    super(props);
    this.state = { };
  }

  componentDidMount () {
    // window.onYouTubeIframeAPIReady = () => {
    //   player = new YT.Player('player', {
    //     height: '390',
    //     width: '640',
    //     videoId: 'M7lc1UVf-VE',
    //     events: {
    //       onReady: onPlayerReady,
    //       onStateChange: onPlayerStateChange
    //     }
    //   });
    // };
  }

  render () {
    return (<iframe width='560' height='315' src='https://www.youtube.com/embed/haT4Q-1_Zv4' frameBorder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' allowFullScreen />
    // <div className='youtube-container'>
    //   <div id="player"></div>

    // <script src='https://www.youtube.com/iframe_api'></script>

    //   // 3. This function creates an <iframe> (and YouTube player)
    //   //    after the API code downloads.
    //   var player;

    //   // 4. The API will call this function when the video player is ready.
    //   function onPlayerReady(event) {
    //     event.target.playVideo();
    //   }

    //   // 5. The API calls this function when the player's state changes.
    //   //    The function indicates that when playing a video (state=1),
    //   //    the player should play for six seconds and then stop.
    //   var done = false;
    //   function onPlayerStateChange(event) {
    //     if (event.data == YT.PlayerState.PLAYING && !done) {
    //       setTimeout(stopVideo, 6000);
    //       done = true;
    //     }
    //   }
    //   function stopVideo() {
    //     player.stopVideo();
    //   }
    // </script> </>
    );
  }
}

export default Youtube;
