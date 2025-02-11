import { expect, test } from "vitest";
import { Note, Notes } from "../src/types";

function noteDistance(from: number, to: number) {
   return (to - from + 12) % 12;
 }

 function Compose(...notes: Note[]) {
   let lastNoteIndex: number = 0;
   return notes.map(noteName=>{
      const noteIndex = Notes[noteName];
      const distance = noteDistance(lastNoteIndex, noteIndex);
      console.log(distance, noteIndex, lastNoteIndex);
      lastNoteIndex = noteIndex;
      return distance;
   })
 }

test("composing", () => {
  expect(noteDistance(0,0)).toBe(0);
  expect(noteDistance(0,3)).toBe(3);
  expect(noteDistance(3,7)).toBe(4);
  expect(noteDistance(5,4)).toBe(11);
  Compose("C", "D#", "G")
});
