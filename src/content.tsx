import "./styles.css";

import { render } from "preact";
import { waitForSelector } from "./dom";
import { useEffect, useRef, useState } from "preact/hooks";
import { TrackApiResponse, TrackKeypoint } from "./types";
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

  const [currentKeypoint, setCurrentKeypoint] = useState<TrackKeypoint>();
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
          video.volume = 0.5;
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
    const passedKeypoints = track.keypoints.filter(k => video.currentTime > k.beat)
    const currentKeypoint = passedKeypoints[passedKeypoints.length - 1];
    setCurrentKeypoint(currentKeypoint);
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
      {/* {window.DEV && (
        <>
          <span>
            Current Beat: {0} @
            {(video.currentTime).toFixed(2)}s
          </span>
        </>
      )} */}

      <div className="overflow-x-auto scrollbar-none flex items-center snap-mandatory gap-4">
        {track.keypoints.map((keypoint, i) => {
          const isCurrent = currentKeypoint == keypoint;

          return (
            <div
              key={i}
              ref={isCurrent ? currentSlotRef : null}
              className={cn("snap-center", !isCurrent && "duration-700 opacity-60")}
            >
              {keypoint ? (
                <>
                  <span className="text-sm font-medium">
                    {keypoint.keys.name} <span className="text-xs leading-none opacity-60">{keypoint.beat}</span>
                  </span>
                  <Piano pressedKeys={keypoint.keys.notes} />
                </>
              ) : (
                <div
                  className={cn(
                    "size-full font-bold text-lg px-8 py-2 rounded-md",
                    isCurrent
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
