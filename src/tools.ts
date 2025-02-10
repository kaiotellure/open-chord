import { INTERVALS, Key, TrackApiResponse } from "./types";

export const log = (...messages: any[]) => console.log("[🎹]", ...messages);

export function getThisYoutubeVideoID() {
  if (window.DEV) return "EbSOKsFHwU8";

  try {
    const url = new URL(window.location.href);
    return url.searchParams.get("v");
  } catch (err) {}
}

export async function fetchTrackForID(id: string): Promise<TrackApiResponse> {
  if (window.DEV) return {
    meta: {
      bpm: 111,
      length: 1,
      offset: 9.5
    },
    keypoints: [
      {after: 0, keys: [1,4,8]}
    ]
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


export {twMerge as cn} from "tailwind-merge";