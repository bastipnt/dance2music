import { Note } from "tone/build/esm/core/type/NoteUnits";
import BaseState from "./BaseState";

export const initialPoseState = {
  rightArm: {
    x: 0,
    y: 0,
  },
};

export type KeyboardEventType = "DOWN" | "UP" | undefined;

export type MidiStateType = {
  keysPressed: Map<Note, number>;
  eventType: KeyboardEventType;
  note: Note | undefined;
  velocity: number | undefined;
};

const initialMidiState: MidiStateType = {
  keysPressed: new Map<Note, number>(),
  eventType: undefined,
  note: undefined,
  velocity: undefined,
};

class MidiState extends BaseState<MidiStateType> {
  execute(_?: any): void {}
}

class PoseState extends BaseState<typeof initialPoseState> {
  execute(_?: any): void {}
}

class AppState {
  midiState: MidiState;
  poseState: PoseState;

  constructor() {
    this.midiState = new MidiState(initialMidiState);
    this.poseState = new PoseState(initialPoseState);
  }
}

export default AppState;
