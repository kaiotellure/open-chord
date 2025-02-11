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
        { beat: 0, keys: chord("Bb", "minor") },
        { beat: 4, keys: chord("Bb", "minor_seventh") },
        { beat: 8, keys: chord("Gb", "major_seventh") },
        { beat: 12, keys: chord("Eb", "dominant_seventh") },
        { beat: 14, keys: chord("F", "dominant_seventh") },
        { beat: 16, keys: chord("Bb", "minor_seventh") },
        { beat: 20, keys: chord("G", "minor_seventh") },
        { beat: 24, keys: chord("Gb", "major_seventh") },
        { beat: 28, keys: chord("C", "minor_seventh") },
        { beat: 30, keys: chord("F", "dominant_seventh") },
        { beat: 32, keys: chord("Bb", "minor_seventh") },
        { beat: 36, keys: chord("G", "dim") },
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
