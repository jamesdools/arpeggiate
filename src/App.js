import React, { Component } from 'react';

import Keyboard from './Components/Keyboard';
import DeviceSelect from './Components/DeviceSelect';

import { attachEventHandlers } from './midi';

class App extends Component {
  constructor() {
    super();
    this.state = {
      midi: {
        inputs: [],
        outputs: []
      },
      resetCurrentMidiInput: () => {}
    };
  }

  componentDidMount() {
    // bodge: make a helper midi module when we know wtf we are doing / wtf we want
    (async () => {
      const devices = await navigator.requestMIDIAccess();
      this.setState({
        midi: {
          inputs: [...devices.inputs.values()],
          outputs: [...devices.outputs.values()]
        }
      });
    })();
  }

  render() {
    return (
      <div className="App">
        <Keyboard/>
        <DeviceSelect
          placeholder={`Inputs`}
          devices={this.state.midi.inputs}
          onDeviceSelected={device => {
            this.state.resetCurrentMidiInput();
            this.setState({
              ...this.state,
              resetCurrentMidiInput: attachEventHandlers(
                device,
                {
                  noteOn: (event) => console.log('note on', event),
                  noteOff: (event) => console.log('note off', event)
                }
              )
            })
          }}
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
