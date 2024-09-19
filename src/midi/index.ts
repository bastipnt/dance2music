import { Note } from "tone/build/esm/core/type/NoteUnits";
import AppState, { KeyboardEventType } from "../state";
import { Frequency } from "tone";

const ARTURIA_KEYLAB_NAME = "Arturia KeyLab Essential 61 MIDI In";

const KEY_DOWN = 144;
const KEY_UP = 128;

const MAX_VELOCITY = 127;

class MidiController {
  private midiAccess?: MIDIAccess;
  private arturiaKeyLab?: MIDIInput;
  private keysPressed = new Map<Note, number>();
  private appState: AppState;

  constructor(appState: AppState) {
    this.appState = appState;
  }

  async init() {
    this.midiAccess = await navigator.requestMIDIAccess();
    // console.log("MIDI ready!");
    // console.log(this.midiAccess.inputs.size);
    this.midiAccess.inputs.forEach((midiInput) => {
      if (midiInput.name === ARTURIA_KEYLAB_NAME)
        this.arturiaKeyLab = midiInput;
    });

    if (this.arturiaKeyLab) {
      this.arturiaKeyLab.addEventListener("midimessage", (event) =>
        this.handleMidiMessage(event as MIDIMessageEvent)
      );
    }
  }

  handleMidiMessage(event: MIDIMessageEvent) {
    const [type, input, value] = event.data;

    let eventType: KeyboardEventType;
    const note = Frequency(input, "midi").toNote();
    const velocity = Number(Number(value / MAX_VELOCITY).toFixed(2));

    if (type === KEY_DOWN) {
      this.keysPressed.set(note, velocity);
      eventType = "DOWN";
    } else if (type === KEY_UP) {
      this.keysPressed.delete(note);
      eventType = "UP";
    }

    this.appState.midiState.updateState({
      keysPressed: new Map(this.keysPressed),
      note,
      velocity,
      eventType,
    });
  }
}

export default MidiController;
