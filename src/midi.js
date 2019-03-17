export function toNoteEvent(bytes) {
  const [status, note, velocity] = bytes;
  const channel = status & 0x0F;
  return {
    note,
    velocity,
    channel
  };
}

const Event = {
  NOTE_ON: 0x90,
  NOTE_OFF: 0x80
};

function toChannelAgnosticEvent(bytes) {
  // Mask off the lower nibble (MIDI channel, which we don't care about)
  return bytes & 0xF0;
}

export function attachEventHandlers(inputDevice, {
  noteOn,
  noteOff,
  ...handlers
}) {
  inputDevice.onmidimessage = event => {
    switch (toChannelAgnosticEvent(event.data[0])) {
      case Event.NOTE_ON:
      {
        const noteEvent = toNoteEvent(event.data);
        if (noteEvent.velocity) {
          noteOn(noteEvent);
        } else {
          noteOff(noteEvent);
        }
        break;
      }
      case Event.NOTE_OFF:
        noteOff(toNoteEvent(event.data));
        break;
      default:
        break;
    }
  };
  const removeHandlers = () => inputDevice.onmidimessage = () => {};
  return removeHandlers;
}

export async function enumerateDevices(globalNavigator = navigator) {
  const devices = await globalNavigator.requestMIDIAccess();
  return {
    inputs: [...devices.inputs.values()],
    outputs: [...devices.outputs.values()]
  };
}