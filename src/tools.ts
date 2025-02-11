import {chord} from "./chords";
import { TrackApiResponse } from "./types";

export const log = (...messages: any[]) => console.log("[🎹]", ...messages);

export function getThisYoutubeVideoID() {
  if (window.DEV) return "EbSOKsFHwU8";

  try {
    const url = new URL(window.location.href);
    return url.searchParams.get("v");
  } catch (err) {}
}

export async function fetchTrackForID(id: string): Promise<TrackApiResponse> {
  if (window.DEV)
    return {
      meta: {
        bpm: 111,
        length: 1,
        offset: 9.5,
      },
      keypoints: [
        { beat: 9.77, keys: chord("Bb", "minor") },
        { beat: 11.65, keys: chord("Bb", "minor_seventh") },
        { beat: 14.15, keys: chord("Gb", "major_seventh") },
        { beat: 16.14, keys: chord("Eb", "dominant_seventh") },
        { beat: 17.10, keys: chord("F", "dominant_seventh") },
        { beat: 18.52, keys: chord("Bb", "minor_seventh") },
        { beat: 20.44, keys: chord("G", "minor_seventh") },
        { beat: 22.99, keys: chord("Gb", "major_seventh") },
        { beat: 24.88, keys: chord("C", "minor_seventh") },
        { beat: 25.97, keys: chord("F", "dominant_seventh") },
        { beat: 27.30, keys: chord("Bb", "minor_seventh") },
        { beat: 29.24, keys: chord("G", "dim") },
        { beat: 31.75, keys: chord("Gb", "major_seventh") },
        { beat: 33.69, keys: chord("C", "minor_seventh") },
        { beat: 34.82, keys: chord("F", "dominant_seventh") },
        { beat: 36.14, keys: chord("Bb", "minor_seventh") },
        { beat: 38.03, keys: chord("G", "minor_seventh") },
        { beat: 40.61, keys: chord("Gb", "major_seventh") },
        { beat: 42.42, keys: chord("C", "minor_seventh") },
        { beat: 43.57, keys: chord("F", "dominant_seventh") },
        { beat: 44.95, keys: chord("Bb", "minor_seventh") },
        { beat: 46.85, keys: chord("Eb", "dominant_seventh") },
        { beat: 49.32, keys: chord("Gb", "major_seventh") },
        { beat: 51.51, keys: chord("C", "minor_seventh") },
        { beat: 52.27, keys: chord("F", "dominant_seventh") },
        { beat: 53.70, keys: chord("Bb", "minor_seventh") },
        { beat: 55.62, keys: chord("G", "minor_seventh") },
        { beat: 57.74, keys: chord("Gb", "major_seventh") },
        { beat: 60.00, keys: chord("C", "minor_seventh") },
        { beat: 61.17, keys: chord("F", "dominant_seventh") },
        { beat: 62.46, keys: chord("Bb", "minor_seventh") },
        { beat: 64.39, keys: chord("G", "minor_seventh") },
        { beat: 66.92, keys: chord("Gb", "major_seventh") },
        { beat: 68.80, keys: chord("C", "minor_seventh") },
        { beat: 69.97, keys: chord("F", "dominant_seventh") },
        { beat: 71.27, keys: chord("Bb", "minor_seventh") },
        { beat: 73.51, keys: chord("G", "dominant_seventh") },
        { beat: 75.71, keys: chord("Gb", "major_seventh") },
        { beat: 77.85, keys: chord("C", "minor_seventh") },
        { beat: 79.00, keys: chord("F", "dominant_seventh") },
        { beat: 80.08, keys: chord("Bb", "minor_seventh") },
        { beat: 82.24, keys: chord("G", "minor_seventh") },
        { beat: 84.48, keys: chord("Gb", "major_seventh") },
        { beat: 86.67, keys: chord("C", "minor_seventh") },
        { beat: 87.77, keys: chord("F", "dominant_seventh") },
        
        { beat: 88.88, keys: chord("Bb", "minor_seventh") },
        { beat: 91.09, keys: chord("G", "minor_seventh") },
        { beat: 93.28, keys: chord("Gb", "major_seventh") },
        { beat: 95.50, keys: chord("C", "minor_seventh") },
        { beat: 96.60, keys: chord("F", "dominant_seventh") },
        
        { beat: 97.64, keys: chord("Bb", "minor_seventh") },
        { beat: 99.89, keys: chord("G", "minor_seventh") },
        { beat: 102.07, keys: chord("Gb", "major_seventh") },
        { beat: 104.23, keys: chord("C", "minor_seventh") },
        { beat: 105.08, keys: chord("F", "dominant_seventh") },
        
        { beat: 106.44, keys: chord("Bb", "minor_seventh") },
        { beat: 108.34, keys: chord("G", "minor_seventh") },
        { beat: 110.56, keys: chord("Gb", "major_seventh") },
        { beat: 112.79, keys: chord("C", "minor_seventh") },
        { beat: 113.84, keys: chord("F", "dominant_seventh") },
        
        { beat: 115.25, keys: chord("Bb", "minor_seventh") },
        { beat: 117.11, keys: chord("G", "minor_seventh") },
        { beat: 119.62, keys: chord("Gb", "major_seventh") },
        { beat: 121.53, keys: chord("C", "minor_seventh") },
        { beat: 122.69, keys: chord("F", "dominant_seventh") },
        
        { beat: 123.98, keys: chord("Bb", "minor_seventh") },
        { beat:125.94, keys: chord("G", "minor_seventh") },
        { beat: 128.45, keys: chord("Gb", "major_seventh") },
        { beat: 130.59, keys: chord("C", "minor_seventh") },

        { beat: 131.73, keys: chord("F", "dominant_seventh") },

        { beat: 133.56, keys: chord("Bb", "minor_seventh") },
      ],
    };

  const response = await fetch(
    `https://kaiotellure.github.io/open-chord/${id}.json`
  );
  return response.json();
}

const STORAGE_PREFIX = "open-chord-";

export async function getTrackForVideo(id: string): Promise<TrackApiResponse> {
  //
  // dont cache in devmode
  if (!window.DEV) {
    try {
      log("trying to get and decode locally cached track for this id.");

      const cached = localStorage.getItem(STORAGE_PREFIX + id);
      if (cached) return JSON.parse(cached);

      log("locally cached track for this id not found.");
    } catch (err) {
      console.error(err);
    }
  }

  try {
    log("trying to fetch and decode remote track for this id.");

    const track = await fetchTrackForID(id);
    localStorage.setItem(STORAGE_PREFIX + id, JSON.stringify(track));

    return track;
    //
  } catch (err) {
    //
    throw err;
  }
}

export function isElementInViewport(el: Element) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top < (window.innerHeight || document.documentElement.clientHeight) &&
    rect.bottom > 0 &&
    rect.left < (window.innerWidth || document.documentElement.clientWidth) &&
    rect.right > 0
  );
}

export { twMerge as cn } from "tailwind-merge";
