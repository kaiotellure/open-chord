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

        if (window.DEV) {
          video.volume = 0.1;
          video.currentTime = track.meta.offset - 1;
          video.focus();
        }

        video.addEventListener("loadedmetadata", () => {
          scheduleBeatUpdates(video, track);
          setVideo(video);
          setTrack(track);
        });
      })
      .catch(console.error);
  }, []);

  function scheduleBeatUpdates(
    video: HTMLVideoElement,
    track: TrackApiResponse
  ) {
    const beatDuration = 60 / track.meta.bpm; // in seconds, for 111 = 0.54
    const currentBeat = Math.floor(
      (video.currentTime - track.meta.offset) / beatDuration
    );

    setCurrentBeat(currentBeat);
    // setTimeout(scheduleBeatUpdates, beatDuration * 100, video, track);
    requestAnimationFrame(scheduleBeatUpdates.bind(null, video, track));
  }

  log("called");

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

  const beatDuration = 60 / track.meta.bpm;
  const totalBeatCount = Math.ceil(video.duration / beatDuration);

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHoveringContainer(true)}
      onMouseLeave={() => setIsHoveringContainer(false)}
      className="p-4 mb-4! bg-red-200/10 rounded"
    >
      {window.DEV && (
        <>
          <span>
            Current Beat: {currentBeat} @
            {(video.currentTime - track.meta.offset).toFixed(2)}s
          </span>
        </>
      )}

      <div className="overflow-x-auto scrollbar-none flex items-center snap-mandatory gap-4">
        {Array.from({ length: totalBeatCount }, (_, i) => {
          const keypoint = track.keypoints.find((k) => k.beat == i);

          return (
            <div
              key={i}
              ref={currentBeat == i ? currentSlotRef : null}
              className={cn("snap-center", currentBeat != i && "opacity-60")}
            >
              {keypoint ? (
                <>
                  <span className="text-sm font-medium">
                    {keypoint.keys.name}
                  </span>
                  <Piano pressedKeys={keypoint.keys.notes} />
                </>
              ) : (
                <div
                  className={cn(
                    "size-full font-bold text-lg px-8 py-2 rounded-md",
                    currentBeat == i
                      ? "bg-rose-500 text-rose-800"
                      : "bg-white/10 text-white/20"
                  )}
                >
                  {(i % 4) + 1}
                </div>
              )}
            </div>
          );
        })}
      </div>
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
