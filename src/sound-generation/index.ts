import { Midi } from "@tonejs/midi";
import {
  AMSynth,
  FMSynth,
  Loop,
  PolySynth,
  Synth,
  getTransport,
  now as toneNow,
} from "tone";

class SoundGeneration {
  async parseMidi(): Promise<Midi> {
    const midi = await Midi.fromUrl("midi-files/Queen.mid");
    return midi;
  }

  async play() {
    // this.debugLogTime();
    //create a synth and connect it to the main output (your speakers)
    // const synth = new Synth().toDestination();
    // const now = toneNow();
    // synth.triggerAttack("C4", now);
    // synth.triggerRelease(now + 1);

    // synth.triggerAttackRelease("C4", "8n", now + 1);
    // synth.triggerAttackRelease("E4", "8n", now + 1.5);
    // synth.triggerAttackRelease("G4", "8n", now + 2);

    const midi = await this.parseMidi();

    console.log(midi);

    const synths = [];

    const now = toneNow() + 0.5;
    midi.tracks.forEach((track) => {
      //create a synth for each track
      const synth = new PolySynth(Synth, {
        envelope: {
          attack: 0.02,
          decay: 0.1,
          sustain: 0.3,
          release: 1,
        },
      }).toDestination();
      synths.push(synth);
      //schedule all of the events
      track.notes.forEach((note) => {
        if (note.duration === 0) return;
        synth.triggerAttackRelease(
          note.name,
          note.duration,
          note.time + now,
          note.velocity
        );
      });
    });

    // // create two monophonic synths
    // const synthA = new FMSynth().toDestination();
    // const synthB = new AMSynth().toDestination();
    // //play a note every quarter-note
    // const loopA = new Loop((time) => {
    //   synthA.triggerAttackRelease("C2", "8n", time);
    // }, "4n").start(0);
    // //play another note every off quarter-note, by starting it "8n"
    // const loopB = new Loop((time) => {
    //   synthB.triggerAttackRelease("C4", "8n", time);
    // }, "4n").start("8n");
    // // all loops start when the Transport is started
    // getTransport().start();
    // // ramp up to 800 bpm over 10 seconds
    // getTransport().bpm.rampTo(800, 10);

    // setTimeout(() => getTransport().stop(), 20000);

    // const synth = new PolySynth(Synth).toDestination();
    // const now = toneNow();
    // synth.triggerAttack("D4", now);
    // synth.triggerAttack("F4", now + 0.5);
    // synth.triggerAttack("A4", now + 1);
    // synth.triggerAttack("C5", now + 1.5);
    // synth.triggerAttack("E5", now + 2);
    // synth.triggerRelease(["D4", "F4", "A4", "C5", "E5"], now + 4);

    // setTimeout(() => {
    //   synth.set({ detune: 5 });
    // }, 2000);

    // setTimeout(() => {
    //   synth.releaseAll();
    // }, 4000);

    // midi.tracks.forEach((track) => {
    //   //tracks have notes and controlChanges

    //   //notes are an array
    //   const notes = track.notes;
    //   notes.forEach((note) => {
    //     //note.midi, note.time, note.duration, note.name
    //     console.log(note);

    //     synth.triggerAttackRelease(note.midi, note.duration, note.time);
    //   });

    //   // //the control changes are an object
    //   // //the keys are the CC number
    //   // track.controlChanges[64]
    //   // //they are also aliased to the CC number's common name (if it has one)
    //   // track.controlChanges.sustain.forEach(cc => {
    //   //   // cc.ticks, cc.value, cc.time
    //   // })

    //   //the track also has a channel and instrument
    //   //track.instrument.name
    // });

    //play a middle 'C' for the duration of an 8th note
    // synth.triggerAttackRelease("C4", "8n");
  }

  debugLogTime() {
    setInterval(() => console.log(toneNow()), 100);
  }
}

export default SoundGeneration;
