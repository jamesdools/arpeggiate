import React from 'react';

import styles from './DeviceSelect.module.css'

const DeviceSelect = ({devices = [], placeholder = `Devices`, ...props}) => (
  <select className={styles.select} {...props}>
    <option value="">{placeholder}</option>
    {devices.map(
      (device, index) => <option key={index} value={index}>{device.name}</option>
    )}
  </select>
);

export default DeviceSelect;
