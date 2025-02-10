import "./styles.css";

import { render } from "preact";
import { waitForSelector } from "./dom";
import { useEffect, useRef, useState } from "preact/hooks";
import { TrackApiResponse } from "./types";
import Piano from "./components/Piano";
import {
  cn,
  fetchTrackForID,
  getThisYoutubeVideoID,
  isElementInViewport,
  log,
} from "./tools";

function ChordsContainer() {
  const [video, setVideo] = useState<HTMLVideoElement>();
  const [track, setTrack] = useState<TrackApiResponse>();

  const [currentBeat, setCurrentBeat] = useState(0);
  const currentSlotRef = useRef<HTMLDivElement>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const [isHoveringContainer, setIsHoveringContainer] = useState(false);

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

      const beatDuration = 60 / track.meta.bpm; // in seconds, for 111 = 0.54
      const currentBeat = Math.floor(video.currentTime / beatDuration);

      setCurrentBeat(currentBeat);
      setTimeout(requestAnimationFrame, beatDuration * 1000, updateCurrentBeat);
    }

    updateCurrentBeat();
  }, [video, track]);

  useEffect(() => {
    if (!currentSlotRef.current || !containerRef.current) return;
    // don't scroll when user is away from video player. eg: comments
    if (!isElementInViewport(containerRef.current)) return;
    // don't scroll when user is hovering container
    if (isHoveringContainer) return;

    currentSlotRef.current.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [currentSlotRef.current]);

  if (!track || !video) return;

  const bps = track.meta.bpm / 60;
  const slices = Math.ceil(video.duration * bps);

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHoveringContainer(true)}
      onMouseLeave={() => setIsHoveringContainer(false)}
      className="relative overflow-x-auto scrollbar-none p-4 flex items-center mb-4! snap-mandatory gap-4"
    >
      {Array.from({ length: slices }, (_, i) => (
        <div
          key={i}
          ref={currentBeat == i ? currentSlotRef : null}
          className={cn("snap-center", currentBeat != i && "opacity-60")}
        >
          <span className="text-sm font-medium">
            {i} {currentBeat}
          </span>
          <Piano />
        </div>
      ))}
    </div>
  );
}

// div.ytp-progress-bar-container: progress bar container
// #above-the-fold: title container

waitForSelector("#above-the-fold").then((titleContainer) => {
  const container = document.createElement("div");
  // insert container empty div before title
  titleContainer.insertBefore(container, titleContainer.firstChild);
  // render to container
  render(<ChordsContainer />, container);
});
