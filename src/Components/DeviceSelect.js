import React, { Component } from 'react';

import styles from './DeviceSelect.module.css';
import { attachEventHandlers, enumerateDevices } from '../midi';

class DeviceSelect extends Component {
  constructor(props) {
    super(props);
    this.selectRef = React.createRef();
  }

  componentDidUpdate(prevProps) {
    const shouldForceSelection = this.props.forceSelectionToIndex
      && this.props.forceSelectionToIndex !== prevProps.forceSelectionToIndex;
    if (shouldForceSelection) {
      this.selectRef.current.selectedIndex = this.props.forceSelectionToIndex;
    }
  }

  render() {
    const {
      devices = [],
      placeholder = 'Devices',
      onDeviceSelected = () => {},
      forceSelectionToIndex,
      ...props
    } = this.props;

    return (
      <select
        className={styles.select}
        onChange={
          (e) => {
            const index = e.target.selectedIndex - 1;
            if (index < 0 || index >= devices.length) return;

            onDeviceSelected(devices[index]);
          }
        }
        ref={this.selectRef}
        {...props}
      >
        <option value="">{placeholder}</option>
        {devices.map(
          (device, index) => <option key={index} value={index}>{device.name}</option>,
        )}
      </select>
    );
  }
}

function currentEmptyInputDevice() {
  return {
    resetHandlers: () => {},
    device: () => null,
  };
}

const WebMidiNotSupported = (props) => <p {...props}>Web MIDI API not supported</p>;

const FallbackDeviceSelect = ({isWebMidiSupported, ...props}) => (
  isWebMidiSupported ? <DeviceSelect {...props} /> : <WebMidiNotSupported />
);

export class ManagedInputDeviceSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputs: [],
      currentInput: currentEmptyInputDevice(),
      forceSelectionToIndex: null,
      isWebMidiSupported: false
    };
  }

  componentDidMount() {
    (async () => {
      const { inputs, isWebMidiSupported } = await enumerateDevices({
        onStateChanged: (e) => {
          const inputs = [...e.target.inputs.values()];
          const currentInput = this.state.currentInput;
          const indexOfCurrentInput = inputs.findIndex(device => device === currentInput.device);
          const isCurrentInputValid = indexOfCurrentInput !== -1;
          this.setState({
            ...this.state,
            inputs,
            currentInput: isCurrentInputValid ? currentInput : currentEmptyInputDevice(),
            forceSelectionToIndex: isCurrentInputValid ? indexOfCurrentInput + 1 : 0,
          });
        },
      });
      this.setState({
        ...this.state,
        inputs,
        isWebMidiSupported
      });
    })();
  }

  render() {
    const { noteOn, noteOff, ...props } = {
      noteOn: () => {},
      noteOff: () => {},
      ...this.props,
    };
    return <FallbackDeviceSelect
      isWebMidiSupported={this.state.isWebMidiSupported}
      devices={this.state.inputs}
      onDeviceSelected={(device) => {
        this.state.currentInput.resetHandlers();
        this.setState({
          ...this.state,
          currentInput: {
            resetHandlers: attachEventHandlers(
              device,
              {
                noteOn,
                noteOff,
              },
            ),
            device,
          },
        });
      }}
      forceSelectionToIndex={this.state.forceSelectionToIndex}
      {...props}
    />;
  }
}

export default DeviceSelect;
