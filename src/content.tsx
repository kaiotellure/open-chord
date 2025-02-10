import { render } from "preact";
import { waitForSelector } from "./dom";
import { useEffect, useRef, useState } from "preact/hooks";
import { TrackApiResponse } from "./types";
import Piano from "./components/Piano";
import { fetchTrackForID, getThisYoutubeVideoID, log } from "./tools";

function ChordsContainer() {
  const [video, setVideo] = useState<HTMLVideoElement>();
  const [track, setTrack] = useState<TrackApiResponse>();

  const [currentBeat, setCurrentBeat] = useState(0);
  const currentSlotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const videoId = getThisYoutubeVideoID();
    if (!videoId) return log("could not get video id");

    fetchTrackForID(videoId)
      .then(async (track) => {
        const video = (await waitForSelector("video")) as HTMLVideoElement;
        if (window.DEV) video.volume = 0.02;

        video.addEventListener("loadedmetadata", () => {
          setTrack(track);
          setVideo(video);
        });
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    function updateCurrentBeat() {
      if (!video || !track) return;

      const bps = track.meta.bpm / 60;
      const currentBeat = Math.floor(video.currentTime / bps);

      log(currentBeat);
      setCurrentBeat(currentBeat);
      setTimeout(requestAnimationFrame, 250, updateCurrentBeat);
    }

    updateCurrentBeat();
  }, [video, track]);

  useEffect(() => {
    if (currentSlotRef.current) {
      currentSlotRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [currentSlotRef.current]);

  if (!track || !video) return;

  const bps = track.meta.bpm / 60;
  const slices = Math.ceil(video.duration * bps);

  return (
    <div
      style={{
        position: "relative",
        overflowX: "auto",
        scrollbarWidth: "none", // Firefox
        msOverflowStyle: "none", // IE & Edge
        WebkitOverflowScrolling: "touch",
        WebkitScrollbar: "none",
        padding: "1.5rem .5rem",
        background: "rgb(50,50,50)",
        borderRadius: "6px",
        display: "flex",
        alignItems: "center",
        marginBottom: "1.25rem",
        scrollSnapType: "x mandatory",
        gap: 12,
      }}
    >
      <div
        style={{
          position: "fixed",
          zIndex: 10,
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "linear-gradient(to right, black 10%, rgb(0,0,0,.1), black 90%)",
        }}
      ></div>

      {Array.from({ length: slices }, (_, i) => (
        <div
          key={i}
          ref={currentBeat == i ? currentSlotRef : null}
          style={{
            scrollSnapAlign: "center",
            opacity: currentBeat == i ? 1 : 0.6,
          }}
        >
          <p
            style={{
              fontSize: 16,
              marginBottom: ".4rem",
              fontWeight: "500",
            }}
          >
            {i} {currentBeat}
          </p>
          <Piano />
        </div>
      ))}
    </div>
  );
}

// div.ytp-progress-bar-container: progress bar container
// #above-the-fold: title container

waitForSelector("#above-the-fold").then((titleContainer) => {
  const root = document.createElement("div");
  titleContainer.insertBefore(root, titleContainer.firstChild);
  render(<ChordsContainer />, root);
});
