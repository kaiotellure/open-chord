const DO_CACHE = false;
const STORAGE_PREFIX = "open-chord-";

import { render } from "preact";
import { waitForSelector } from "./dom-manipulation";
import { useEffect, useState } from "preact/hooks";
import { TrackApiResponse, TrackKeypoint } from "./types";
import { Text } from "./components/Text";
import Piano from "./components/Piano";

const log = (...messages: any[]) => console.log("[🎹]", ...messages);

function getThisYoutubeVideoID() {
  try {
    const url = new URL(
      "https://www.youtube.com/watch?v=EbSOKsFHwU8" || window.location.href
    );
    return url.searchParams.get("v");
  } catch (err) {}
}

function fetchTrackForID(id: string): Promise<TrackApiResponse> {
  return new Promise((resolve) => {
    setTimeout(resolve, 100, {
      meta: {
        transcriber: {
          name: "Kaio Tellure",
          social: "github.com/kaiotellure",
        },
      },
      keypoints: [{ t: 5, k: [1, 4, 8, 11], n: "Cm9" }],
    } as TrackApiResponse);
  });
  // fetch("https://servercomingsoon.com/tracks/" + id)
}

async function getTrackForVideo(id: string): Promise<TrackApiResponse> {
  if (DO_CACHE) {
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

function ChordsContainer() {
  const [track, setTrack] = useState<TrackApiResponse>();
  const [currentKeypoint, setCurrentKeypoint] = useState<TrackKeypoint>();

  useEffect(() => {
    const videoId = getThisYoutubeVideoID();
    if (!videoId) return;

    getTrackForVideo(videoId)
      .then(async (track) => {
        //
        setTrack(track);
        const video = (await waitForSelector("video")) as HTMLVideoElement;

        function onNextFrame() {
          const pastKeypoints = track.keypoints.filter(
            (x) => video.currentTime >= x.t
          );
          const currentKeypoint = pastKeypoints[pastKeypoints.length - 1];

          if (currentKeypoint) setCurrentKeypoint(currentKeypoint);
          // in 500ms do this again
          if (video) setTimeout(requestAnimationFrame, 500, onNextFrame);
        }

        requestAnimationFrame(onNextFrame);
      })
      .catch((err) => {
        console.error(err);
        // todo handle error here, display to user
      });
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        bottom: "100%",
        marginBottom: ".6em",
        width: "fit-content",
        padding: ".2em",
        background: "rgb(10,10,10,.9)",
        border: "solid 1px rgb(255,255,255,.2)",
        borderRadius: "2px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        pointerEvents: "none",
        gap: 2
      }}
    >
      {currentKeypoint && (
        <>
          <Text size={16}>{currentKeypoint.n}</Text>
          <Piano pressedKeys={currentKeypoint.k} />
        </>
      )}
    </div>
  );
}

waitForSelector("div.ytp-progress-bar-container").then(
  (progressBarContainer) => {
    const root = document.createElement("div");
    progressBarContainer.appendChild(root);
    render(<ChordsContainer />, root);
  }
);
