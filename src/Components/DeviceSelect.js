import React, { Component } from 'react';

import styles from './DeviceSelect.module.css';
import { attachEventHandlers, enumerateDevices } from '../midi';

const DeviceSelect = ({
  devices = [],
  placeholder = 'Devices',
  onDeviceSelected = () => {},
  ...props
}) => (
  <select
    className={styles.select}
    onChange={
      (e) => {
        const index = e.target.selectedIndex - 1;
        if (index < 0 || index >= devices.length) return;

        onDeviceSelected(devices[index]);
      }
    }
    {...props}
  >
    <option value="">{placeholder}</option>
    {devices.map(
      (device, index) => <option key={index} value={index}>{device.name}</option>,
    )}
  </select>
);

export class ManagedInputDeviceSelect extends Component {
  constructor() {
    super();
    this.state = {
      inputs: [],
      resetCurrentInput: () => {},
    };
  }

  componentDidMount() {
    (async () => {
      const { inputs } = await enumerateDevices();
      this.setState({
        ...this.state,
        inputs,
      });
    })();
  }

  render() {
    const { noteOn, noteOff, ...props } = {
      noteOn: () => {},
      noteOff: () => {},
      ...this.props,
    };
    return <DeviceSelect
      devices={this.state.inputs}
      onDeviceSelected={(device) => {
        this.state.resetCurrentInput();
        this.setState({
          ...this.state,
          resetCurrentInput: attachEventHandlers(
            device,
            {
              noteOn,
              noteOff,
            },
          ),
        });
      }}
      {...props}
    />;
  }
}

export default DeviceSelect;
