import "./styles.css";

import { render } from "preact";
import { waitForSelector } from "./dom";
import { useEffect, useRef, useState } from "preact/hooks";
import { TrackApiResponse, TrackKeypoint } from "./types";
import Piano from "./components/Piano";
import {
  cn,
  DEV,
  fetchTrackForID,
  getThisYoutubeVideoID,
  isElementInViewport,
  isLocalServer,
  log,
} from "./tools";
import { prettyNotation } from "./chords";

function ChordsContainer() {
  const [video, setVideo] = useState<HTMLVideoElement>();
  const [track, setTrack] = useState<TrackApiResponse>();

  /**
   * 
   */
  const [isInvalidated, setIsInvalidated] = useState(false);

  const [currentKeypoint, setCurrentKeypoint] = useState<TrackKeypoint>();
  const currentSlotRef = useRef<HTMLDivElement>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const [isHoveringContainer, setIsHoveringContainer] = useState(false);

  useEffect(() => {
    const videoId = getThisYoutubeVideoID();
    if (!videoId) return;

    fetchTrackForID(videoId)
      .then(async (track) => {
        const video = await waitForSelector<HTMLVideoElement>("video");

        if (DEV) {
          video.volume = 0.1;
          video.currentTime = 8;
          video.focus();
        }

        function onVideoReady() {
          scheduleBeatUpdates(video, track);
          setVideo(video);
          setTrack(track);
        }

        video.duration
          ? onVideoReady()
          : (video.onloadedmetadata = onVideoReady);

        document.addEventListener("onClientNavigation", () => {
          const nextVideoId = getThisYoutubeVideoID();
          setIsInvalidated(nextVideoId != videoId);
        });
      })
      .catch(console.error);
  }, []);

  function scheduleBeatUpdates(
    video: HTMLVideoElement,
    track: TrackApiResponse
  ) {
    const passedKeypoints = track.keypoints.filter(
      (k) => video.currentTime > k.at
    );
    const currentKeypoint = passedKeypoints[passedKeypoints.length - 1];
    setCurrentKeypoint(currentKeypoint);
    // run again next frame
    requestAnimationFrame(() => {
      scheduleBeatUpdates(video, track);
    });
  }

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

  if (!track || !video || isInvalidated) return;

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHoveringContainer(true)}
      onMouseLeave={() => setIsHoveringContainer(false)}
      className="px-4 py-2 mb-4!"
    >
      <div className="overflow-x-auto scrollbar-none flex items-center snap-mandatory gap-4">
        {track.keypoints.map((keypoint, i) => {
          const isCurrent = currentKeypoint == keypoint;

          return (
            <div
              key={i}
              ref={isCurrent ? currentSlotRef : null}
              onClick={() => (video.currentTime = Math.round(keypoint.at))}
              className={cn(
                "snap-center cursor-pointer",
                !isCurrent && "duration-700 opacity-60"
              )}
            >
              {keypoint ? (
                <>
                  <span className="mb-2! text-lg font-medium">
                    {keypoint.ch.nm}
                    {DEV && (
                      <span className="ml-1! text-[10px] leading-none opacity-60">
                        {keypoint.at}
                      </span>
                    )}
                  </span>
                  <Piano pressedKeys={keypoint.ch.ns} />
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

      <div className="mt-2! text-[8px] opacity-20 gap-2 w-full flex items-center">
        <span>
          Transcriber: <strong>{track.meta.author}</strong>
        </span>
        <span>
          Track KEY:{" "}
          <strong>{prettyNotation(track.meta.key || "NOT SPECIFIED")}</strong>
        </span>
        <span>
          Track BPM: <strong>{track.meta.bpm}</strong>
        </span>
      </div>
    </div>
  );
}

function isVideoPage() {
  // allow script to run when in preview.html
  if (isLocalServer()) return true;
  return location.href.includes("youtube.com/watch");
}

const injectedPagesId = new Set();
const clientNavigationEvent = new Event("onClientNavigation");

function onPageClientNavigation() {
  document.dispatchEvent(clientNavigationEvent);

  const videoId = getThisYoutubeVideoID();
  if (!videoId) return;

  if (isVideoPage() && !injectedPagesId.has(videoId)) {
    log("injecting in video", videoId);
    injectedPagesId.add(videoId);

    waitForSelector("#above-the-fold").then((titleContainer) => {
      const id = "youtube-chords-container";
      let container = document.getElementById(id);

      // create our container if doesn't exists yet
      // added to avoid duplicated containers in dev page with hmr
      if (!container) {
        container = document.createElement("div");
        container.id = id;
        // insert before the youtube's title
        titleContainer.insertBefore(container, titleContainer.firstChild);
      }

      render(<ChordsContainer />, container);
    });
  }
}

// Detect URL changes using a MutationObserver
const observer = new MutationObserver(() => {
  onPageClientNavigation();
});

// Observe changes to the `<title>` element, which updates when the URL changes
observer.observe(document.querySelector("title") as HTMLTitleElement, {
  childList: true,
});

// Run the script initially when the page loads
onPageClientNavigation();
