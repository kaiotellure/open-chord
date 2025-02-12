import { myTranscription } from "../transcribing";
import { TrackApiResponse } from "./types";

export const DEV = import.meta.env.MODE == "development";
export const log = (...messages: any[]) => console.log("[🎹]", ...messages);

export function getThisYoutubeVideoID() {
  if (DEV) return "local";

  try {
    const url = new URL(window.location.href);
    return url.searchParams.get("v");
  } catch (err) {}
}

export async function fetchTrackForID(id: string): Promise<TrackApiResponse> {
  if (DEV) return myTranscription;

  const response = await fetch(
    `https://kaiotellure.github.io/open-chord/${id}.json`
  );
  return response.json();
}

const STORAGE_PREFIX = "open-chord-";

export async function getTrackForVideo(id: string): Promise<TrackApiResponse> {
  // only load from cache when in "production"
  if (!DEV) {
    try {
      const cached = localStorage.getItem(STORAGE_PREFIX + id);
      if (cached) return JSON.parse(cached);
      //
    } catch (err) {
      console.error(err);
    }
  }

  try {
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
