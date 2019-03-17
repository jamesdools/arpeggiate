import React from 'react';

import styles from './DeviceSelect.module.css';

import {attachEventHandlers} from '../midi';

// bodge: the API here is garbage, currently there are going to be dangling event handlers.
// i.e. you choose one device, we register note-on and note-off handlers for you
// then if another device is selected, we don't de-register the old handlers
// so there is a bunch of undesired stuff handling note events
const DeviceSelect = ({
  devices = [],
  placeholder = `Devices`,
  onDeviceSelected = {
    noteOn: () => {},
    noteOff: () => {}
  },
  ...props
}) => (
  <select
    className={styles.select}
    onChange={
      (e) => {
        const index = e.target.selectedIndex - 1;
        if (index < 0 || index >= devices.length) return;

        const resetDevice = attachEventHandlers(
          devices[index],
          onDeviceSelected
        ); // bodge: do something with this
      }
    }
    {...props}
  >
    <option value="">{placeholder}</option>
    {devices.map(
      (device, index) => <option key={index} value={index}>{device.name}</option>
    )}
  </select>
);

export default DeviceSelect;
