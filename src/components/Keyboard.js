import React, { Component } from 'react';
import { Piano, KeyboardShortcuts, MidiNumbers } from 'react-piano';

import SoundfontProvider from './SoundfontProvider';

import 'react-piano/dist/styles.css';

class Keyboard extends Component {
  onPlayNoteInput = (midiNumber) => {
    console.log(midiNumber);
  }

  render() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const soundfontHostname = 'https://d1pzp51pvbm36p.cloudfront.net';

    const noteRange = {
      first: MidiNumbers.fromNote('c3'),
      last: MidiNumbers.fromNote('f4'),
    };

    const keyboardShortcuts = KeyboardShortcuts.create({
      firstNote: noteRange.first,
      lastNote: noteRange.last,
      keyboardConfig: KeyboardShortcuts.HOME_ROW,
    });

    return (
      <SoundfontProvider
        instrumentName="acoustic_grand_piano"
        audioContext={audioContext}
        hostname={soundfontHostname}
        render={({ isLoading, playNote, stopNote }) => (
          <Piano
            width={640}
            noteRange={noteRange}
            playNote={playNote}
            stopNote={stopNote}
            disabled={isLoading}
            keyboardShortcuts={keyboardShortcuts}
            keyWidthToHeight={0.22}
            onPlayNoteInput={this.onPlayNoteInput}
          />
        )}
      />
    );
  }
}

export default Keyboard;
