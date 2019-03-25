import React, { Component } from 'react';
import { Piano, KeyboardShortcuts, MidiNumbers } from 'react-piano';

import SoundfontProvider from './SoundfontProvider';

// import 'react-piano/dist/styles.css';
import './Keyboard.css';

import { ManagedInputDeviceSelect } from './DeviceSelect';
import { AudioContext } from '../polyfills';

class MidiNoteSet {
  constructor() {
    this.notes = new Set();
  }

  insert(note) {
    this.notes.add(note);
    return [...this.notes];
  }

  erase(note) {
    this.notes.delete(note);
    return this.notes.size ? [...this.notes] : null;
  }
}

class Keyboard extends Component {
  constructor(props) {
    super(props);
    this.heldMidiNotes = new MidiNoteSet();
    this.state = {
      heldMidiNotes: null
    };
  }

  onPlayNoteInput = (midiNumber) => {
    console.log(midiNumber);
  }

  render() {
    const audioContext = new AudioContext();
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
          <>
            <Piano
              className={'keyboard'}
              width={640}
              noteRange={noteRange}
              playNote={playNote}
              stopNote={stopNote}
              disabled={isLoading}
              keyboardShortcuts={keyboardShortcuts}
              keyWidthToHeight={0.26}
              activeNotes={this.state.heldMidiNotes}
            />
            <ManagedInputDeviceSelect
              placeholder={'Inputs'}
              noteOn={event => {
                this.setState({
                  ...this.state,
                  heldMidiNotes: this.heldMidiNotes.insert(event.note)
                });
              }}
              noteOff={event => {
                this.setState({
                  ...this.state,
                  heldMidiNotes: this.heldMidiNotes.erase(event.note)
                });
              }}
            />
          </>
        )}
      />
    );
  }
}

export default Keyboard;
