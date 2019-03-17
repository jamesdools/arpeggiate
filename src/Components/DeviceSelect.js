import React from 'react';

import styles from './DeviceSelect.module.css';

const DeviceSelect = ({
  devices = [],
  placeholder = `Devices`,
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
      (device, index) => <option key={index} value={index}>{device.name}</option>
    )}
  </select>
);

export default DeviceSelect;
