import React, { Component } from 'react';
import { Piano, KeyboardShortcuts, MidiNumbers } from 'react-piano';

import Keyboard from './components/Keyboard';

import 'react-piano/dist/styles.css';

const DeviceSelect = ({devices = [], placeholder = `Devices`, ...props}) => (
  <select {...props}>
    <option value="">{placeholder}</option>
    {devices.map(
      (device, index) => <option key={index} value={index}>{device.name}</option>
    )}
  </select>
);

class App extends Component {

  constructor() {
    super();
    this.state = {
      midi: {
        inputs: [],
        outputs: []
      }
    };
  }

  componentDidMount() {
    // bodge: make a helper midi module when we know wtf we are doing / wtf we want
    (async () => {
      const devices = await navigator.requestMIDIAccess();
      this.setState({
        ...this.state,
        midi: {
          inputs: [...devices.inputs.values()],
          outputs: [...devices.outputs.values()]
        }
      });
    })();
  }

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
        <DeviceSelect
          placeholder={`Inputs`}
          devices={this.state.midi.inputs}
        />
        <DeviceSelect
          placeholder={`Outputs`}
          devices={this.state.midi.outputs}
        />
      </div>
    );
  }
}

export default App;
