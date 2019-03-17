import React, { Component } from 'react';

import * as mm from '@magenta/music';

class Magenta extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPlayerLoaded: false,
      isPlaying: false,
    };

    this.loadPlayer();
  }

  async loadPlayer() {
    this.player = await (() => {
      new Promise((resolve) => {
        resolve(new mm.SoundFontPlayer('https://storage.googleapis.com/magentadata/js/soundfonts/salamander'));
      })();
    });

    this.player.callbackObject = {
      run: (note) => {
        this.visualizer.redraw(note);
      },
      stop: () => this.setState({ isPlaying: false }),
    };

    this.setState({ isPlayerLoaded: true });
  }

  render() {
    return (
      <div/>
    );
  }
}

export default Magenta;
