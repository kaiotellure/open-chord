log("info", "content script inserted");
import "./styles.css";

import { render } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";

import KeyValueText from "./components/KeyValueText";
import Piano from "./components/Piano";

import { prettyNotation } from "./chords";
import { waitForSelector, watchForTitleChanges } from "./dom";
import type { TrackApiResponse, TrackKeypoint } from "./types";

import {
	cn,
	fetchTrackForID,
	getThisYoutubeVideoID,
	isElementInViewport,
	log,
} from "./tools";

function ChordsContainer(props: {
	videoId: string;
	track: TrackApiResponse;
	video: HTMLVideoElement;
}) {
	// a ref pointing to the current highlighted chord
	const highlightedChordRef = useRef<HTMLDivElement>(null);
	// used to disable chords scrolling when user is not seeing the chords box
	const chordsContainerRef = useRef<HTMLDivElement>(null);
	// the effect running every frame sets here the current chord to display
	const [currentKeypoint, setCurrentKeypoint] = useState<TrackKeypoint>();
	// used to disable chords scrolling when user is hovering the chords box
	const [isHoveringContainer, setIsHoveringContainer] = useState(false);

	/** keep a loop running to update the current chord to display */
	useEffect(() => {
		let stop: boolean;

		function everyFrame() {
			// get all past keypoints
			const passedKeypoints = props.track.keypoints.filter(
				(k) => props.video.currentTime > k.at,
			);
			// the last keypoint is our new current one
			const nextCurrentKeypoint = passedKeypoints[passedKeypoints.length - 1];
			// sets, react doesn't re-render if it's the same
			setCurrentKeypoint(nextCurrentKeypoint);
			// run again next frame
			if (!stop) requestAnimationFrame(everyFrame);
		}

		everyFrame();
		return () => {
			stop = true;
		};
	}, [props.track, props.video]);

	if (!import.meta.env.PROD) {
		useEffect(() => {
			props.video.volume = 0.5;
			props.video.focus();
		}, [props.video]);
	}

	if (
		highlightedChordRef.current && // there's a current chord piano
		chordsContainerRef.current && // chords container is defined
		!isHoveringContainer && // user isn't interacting with chords
		isElementInViewport(chordsContainerRef.current) // user is seeing the chords
	) {
		highlightedChordRef.current.scrollIntoView({
			behavior: "smooth",
			block: "nearest",
			inline: "center",
		});
	}

	return (
		<div
			ref={chordsContainerRef}
			className="px-4 py-2 mb-4!"
			onMouseEnter={() => setIsHoveringContainer(true)}
			onMouseLeave={() => setIsHoveringContainer(false)}
		>
			<div className="overflow-x-auto scrollbar-none flex items-center snap-mandatory gap-4">
				{props.track.keypoints.map((keypoint) => {
					const isCurrent = currentKeypoint === keypoint;

					return (
						<div
							className={cn(
								"snap-center pointer-events-none",
								!isCurrent && "duration-700 opacity-60",
							)}
							key={keypoint.at}
							ref={isCurrent ? highlightedChordRef : undefined}
						>
							<span className="mb-2! text-lg font-medium">
								{/* Chord Name ------ */}
								{keypoint.ch.nm}

								{/* In Dev Show Chord Time ------ */}
								{!import.meta.env.PROD && (
									<span className="ml-1! text-[10px] leading-none opacity-60">
										{keypoint.at}
									</span>
								)}
							</span>

							<Piano pressedKeys={keypoint.ch.ns} />
						</div>
					);
				})}
			</div>

			{/* Song Properties Small Text ------------- */}
			<div className="mt-2! text-[8px] opacity-20 gap-2 w-full flex items-center">
				<KeyValueText label="Transcriber">
					{props.track.meta.author}
				</KeyValueText>

				<KeyValueText label="Track KEY">
					{prettyNotation(props.track.meta.key || "NOT SPECIFIED")}
				</KeyValueText>

				<KeyValueText label="Track BPM">{props.track.meta.bpm}</KeyValueText>
			</div>
		</div>
	);
}

function createChordsRoot(id: string, at: Node) {
	const existingRoot = document.getElementById(id);

	if (existingRoot) {
		log("info", "previous chords root found, un-rendering...");

		render(null, existingRoot);
		return existingRoot;
	}

	const root = document.createElement("div");
	root.id = id;

	at.insertBefore(root, at.firstChild);
	return root;
}

function inject(videoId: string) {
	log("info", "waiting for yt title container");

	waitForSelector("#above-the-fold")
		.then(async (titleContainer) => {
			//
			const root = createChordsRoot("youtube-chords-container", titleContainer);

			log("info", "waiting for video element");
			const video = await waitForSelector<HTMLVideoElement>("video");

			try {
				log("info", "fetching track...");
				const track = await fetchTrackForID(videoId);

				render(
					<ChordsContainer videoId={videoId} video={video} track={track} />,
					root,
				);
			} catch (err) {
				log("warn", "transcription for this video not found");
			}
		})
		.catch((err) => {
			log("error", "wait for yt title container was cancelled, err:", err);
		});
}

window.addEventListener("onVideoIdChanged", () => {
	const videoId = getThisYoutubeVideoID();
	if (videoId) inject(videoId);
});

let videoId = getThisYoutubeVideoID();

window.addEventListener("onTitleChanged", () => {
	const newVideoId = getThisYoutubeVideoID();

	if (newVideoId !== videoId) {
		log("info", "video id changed from", videoId, "to", newVideoId);

		window.dispatchEvent(new Event("onVideoIdChanged"));
		videoId = newVideoId;
	}
});

watchForTitleChanges();
if (videoId) inject(videoId);
