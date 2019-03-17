import React, { Component } from 'react';
import { Piano, KeyboardShortcuts, MidiNumbers } from 'react-piano';

import Keyboard from './components/Keyboard';

import 'react-piano/dist/styles.css';

class App extends Component {
  render() {
    const firstNote = MidiNumbers.fromNote('c3');
    const lastNote = MidiNumbers.fromNote('f5');
    const keyboardShortcuts = KeyboardShortcuts.create({
      firstNote: firstNote,
      lastNote: lastNote,
      keyboardConfig: KeyboardShortcuts.HOME_ROW,
    });

    return (
      <div className="App">
        <header className="App-header"></header>
          <Piano
          noteRange={{ first: firstNote, last: lastNote }}
          playNote={(midiNumber) => {}}
          stopNote={(midiNumber) => {}}
          width={1000}
          keyboardShortcuts={keyboardShortcuts}
          />
      </div>
    );
  }
}

export default App;
