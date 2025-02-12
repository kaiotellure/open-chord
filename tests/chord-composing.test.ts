import { expect, test } from "vitest";
import { compose, noteDistance, chord } from "../src/chords";

test("ensure noteDistance presumption and compose behaviour", () => {
  expect(noteDistance(0, 0)).toBe(0);
  expect(noteDistance(0, 3)).toBe(3);
  expect(noteDistance(3, 7)).toBe(4);
  expect(noteDistance(5, 4)).toBe(11);
  expect(compose("C", "D#", "G")).toStrictEqual([0, 3, 7]);
});

test("ensure chords patterns are correct", () => {
  expect(chord("Bb", "minor").ns).toStrictEqual([10, 13, 17]);
  expect(chord("Bb", "minor_seventh").ns).toStrictEqual([10, 13, 17, 20]);
  expect(chord("Gb", "major_seventh").ns).toStrictEqual([6, 10, 13, 17]);
  expect(chord("Eb", "dominant_seventh").ns).toStrictEqual([3, 7, 10, 13]);
  expect(chord("G", "dim").ns).toStrictEqual([7, 10, 13]);
});
