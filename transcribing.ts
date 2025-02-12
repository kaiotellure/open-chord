import fs from "fs";
import { TrackApiResponse } from "./src/types";
import { chord, prettyNotation } from "./src/chords";

export const videoId = "EbSOKsFHwU8";

export const myTranscription: TrackApiResponse = {
  meta: {
    bpm: 111,
    key: prettyNotation("Bbm"),
    author: "@kaiotellure",
  },
  keypoints: [
    { at: 9.77, ch: chord("Bb", "minor") },
    { at: 11.65, ch: chord("Bb", "minor_seventh") },
    { at: 14.15, ch: chord("Gb", "major_seventh") },
    { at: 16.14, ch: chord("Eb", "dominant_seventh") },
    { at: 17.1, ch: chord("F", "dominant_seventh") },
    { at: 18.52, ch: chord("Bb", "minor_seventh") },
    { at: 20.44, ch: chord("G", "minor_seventh") },
    { at: 22.99, ch: chord("Gb", "major_seventh") },
    { at: 24.88, ch: chord("C", "minor_seventh") },
    { at: 25.97, ch: chord("F", "dominant_seventh") },
    { at: 27.3, ch: chord("Bb", "minor_seventh") },
    { at: 29.24, ch: chord("G", "dim") },
    { at: 31.75, ch: chord("Gb", "major_seventh") },
    { at: 33.69, ch: chord("C", "minor_seventh") },
    { at: 34.82, ch: chord("F", "dominant_seventh") },
    { at: 36.14, ch: chord("Bb", "minor_seventh") },
    { at: 38.03, ch: chord("G", "minor_seventh") },
    { at: 40.61, ch: chord("Gb", "major_seventh") },
    { at: 42.42, ch: chord("C", "minor_seventh") },
    { at: 43.57, ch: chord("F", "dominant_seventh") },
    { at: 44.95, ch: chord("Bb", "minor_seventh") },
    { at: 46.85, ch: chord("Eb", "dominant_seventh") },
    { at: 49.32, ch: chord("Gb", "major_seventh") },
    { at: 51.51, ch: chord("C", "minor_seventh") },
    { at: 52.27, ch: chord("F", "dominant_seventh") },
    { at: 53.7, ch: chord("Bb", "minor_seventh") },
    { at: 55.62, ch: chord("G", "minor_seventh") },
    { at: 57.74, ch: chord("Gb", "major_seventh") },
    { at: 60.0, ch: chord("C", "minor_seventh") },
    { at: 61.17, ch: chord("F", "dominant_seventh") },
    { at: 62.46, ch: chord("Bb", "minor_seventh") },
    { at: 64.39, ch: chord("G", "minor_seventh") },
    { at: 66.92, ch: chord("Gb", "major_seventh") },
    { at: 68.8, ch: chord("C", "minor_seventh") },
    { at: 69.97, ch: chord("F", "dominant_seventh") },
    { at: 71.27, ch: chord("Bb", "minor_seventh") },
    { at: 73.51, ch: chord("G", "dominant_seventh") },
    { at: 75.71, ch: chord("Gb", "major_seventh") },
    { at: 77.85, ch: chord("C", "minor_seventh") },
    { at: 79.0, ch: chord("F", "dominant_seventh") },
    { at: 80.08, ch: chord("Bb", "minor_seventh") },
    { at: 82.24, ch: chord("G", "minor_seventh") },
    { at: 84.48, ch: chord("Gb", "major_seventh") },
    { at: 86.67, ch: chord("C", "minor_seventh") },
    { at: 87.77, ch: chord("F", "dominant_seventh") },

    { at: 88.88, ch: chord("Bb", "minor_seventh") },
    { at: 91.09, ch: chord("G", "minor_seventh") },
    { at: 93.28, ch: chord("Gb", "major_seventh") },
    { at: 95.5, ch: chord("C", "minor_seventh") },
    { at: 96.6, ch: chord("F", "dominant_seventh") },

    { at: 97.64, ch: chord("Bb", "minor_seventh") },
    { at: 99.89, ch: chord("G", "minor_seventh") },
    { at: 102.07, ch: chord("Gb", "major_seventh") },
    { at: 104.23, ch: chord("C", "minor_seventh") },
    { at: 105.08, ch: chord("F", "dominant_seventh") },

    { at: 106.44, ch: chord("Bb", "minor_seventh") },
    { at: 108.34, ch: chord("G", "minor_seventh") },
    { at: 110.56, ch: chord("Gb", "major_seventh") },
    { at: 112.79, ch: chord("C", "minor_seventh") },
    { at: 113.84, ch: chord("F", "dominant_seventh") },

    { at: 115.25, ch: chord("Bb", "minor_seventh") },
    { at: 117.11, ch: chord("G", "minor_seventh") },
    { at: 119.62, ch: chord("Gb", "major_seventh") },
    { at: 121.53, ch: chord("C", "minor_seventh") },
    { at: 122.69, ch: chord("F", "dominant_seventh") },

    { at: 123.98, ch: chord("Bb", "minor_seventh") },
    { at: 125.94, ch: chord("G", "minor_seventh") },
    { at: 128.45, ch: chord("Gb", "major_seventh") },
    { at: 130.59, ch: chord("C", "minor_seventh") },

    { at: 131.73, ch: chord("F", "dominant_seventh") },

    { at: 133.56, ch: chord("Bb", "minor_seventh") },
  ],
};

if (typeof window == "undefined") {
  fs.writeFileSync(
    "./docs/" + videoId + ".json",
    JSON.stringify(myTranscription)
  );
}
