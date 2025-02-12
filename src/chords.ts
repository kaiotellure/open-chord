import { Notes } from "./tables";
import { Note } from "./types";

const Patterns = {
  minor: {suffix: "m", offs: [3, 7]},
  dim: {suffix:"ᵈⁱᵐ", offs:[3, 6]},
  minor_seventh: {suffix:"m⁷", offs:[3, 7, 10]},
  major_seventh: {suffix:"ᵐᵃʲ⁷", offs:[4, 7, 11]},
  dominant_seventh: {suffix:"⁷", offs:[4, 7, 10]},
} as const;

export function prettyNotation(s: string) {
  return s.replace("b", "♭");
}

export function chord(root: Note, pattern: keyof typeof Patterns) {
  const base = Notes[root];
  const chord = Patterns[pattern];

  return {
   nm: `${prettyNotation(root)}${chord.suffix}`,
   ns: [base, ...chord.offs.map((offset) => base + offset)]
  };
}

export function noteDistance(from: number, to: number) {
  return (to - from + 12) % 12;
}

export function compose(...notes: Note[]) {
  let lastNoteIndex: number = 0;
  let sum: number = 0;

  return notes.map((noteName) => {
    const noteIndex = Notes[noteName];
    const distance = noteDistance(lastNoteIndex, noteIndex);
    sum += distance;
    lastNoteIndex = noteIndex;
    return sum;
  });
}
