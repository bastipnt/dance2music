import { FMSynth, PolySynth } from "tone";
import AppState, { MidiStateType } from "../state";
import { Note } from "tone/build/esm/core/type/NoteUnits";

class KeyboardSound {
  private appState: AppState;
  private polySynth: PolySynth;

  constructor(appState: AppState) {
    this.appState = appState;
    this.polySynth = new PolySynth(FMSynth, {
      envelope: {
        attack: 0.001,
        sustain: 1,
        release: 2,
        decay: 1,
      },
    });
  }

  init() {
    this.addEventListeners();
    this.polySynth.toDestination();
  }

  private addEventListeners() {
    this.appState.midiState.subscribe(this.handleMidiStateChange);
  }

  private handleMidiStateChange = (midiState: MidiStateType) => {
    console.log({ midiState });
    if (midiState.eventType === "DOWN" && midiState.note !== undefined)
      this.play(midiState.note, midiState.velocity || 100);
    if (midiState.eventType === "UP" && midiState.note !== undefined)
      this.release(midiState.note);
  };

  private play(note: Note, velocity: number) {
    this.polySynth.triggerAttack(note, undefined, velocity);
    console.log(note, velocity);
  }

  private release(note: Note) {
    this.polySynth.triggerRelease(note);
  }
}

export default KeyboardSound;
