import "./styles.css";

import { render } from "preact";

import { useEffect, useRef, useState } from "preact/hooks";
import { prettyNotation } from "./chords";
import KeyValueText from "./components/KeyValueText";
import Piano from "./components/Piano";
import { waitForSelector } from "./dom";
import {
	cn,
	fetchTrackForID,
	getThisYoutubeVideoID,
	isElementInViewport,
	isLocalServer,
	log,
} from "./tools";
import type { TrackApiResponse, TrackKeypoint } from "./types";

function ChordsContainer(props: {
	initialVideoId: string;
	initialTrack: TrackApiResponse;
	video: HTMLVideoElement;
}) {
	const [videoId, setVideoId] = useState(props.initialVideoId);
	const [track, setTrack] = useState(props.initialTrack);
	// when user navigates to another video page or a non-video page
	// this is used to stop the every frame loop, also to hide chords
	// box when current video doesn't have transcriptions
	const [shouldHide, setShouldHide] = useState(false);
	// the effect running every frame sets here the current chord to display
	const [currentKeypoint, setCurrentKeypoint] = useState<TrackKeypoint>();
	// a ref pointing to the current highlighted chord
	const currentSlotRef = useRef<HTMLDivElement>(null);
	// used to disable chords scrolling when user is not seeing the chords box
	const containerRef = useRef<HTMLDivElement>(null);
	// used to disable chords scrolling when user is hovering the chords box
	const [isHoveringContainer, setIsHoveringContainer] = useState(false);

	/**
	 * detect when user navigates to other video page and update video id
	 * to trigger other effects to fetch the track for this new id
	 */
	useEffect(() => {
		function onNavigation() {
			const nextVideoId = getThisYoutubeVideoID();
			if (nextVideoId) setVideoId(nextVideoId);
		}

		const eventName = "onClientNavigation";
		document.addEventListener(eventName, onNavigation);
		return () => document.removeEventListener(eventName, onNavigation);
	}, []);

	useEffect(() => {
		fetchTrackForID(videoId)
			.then((track) => {
				setTrack(track);
				setShouldHide(false);
			})
			.catch(() => setShouldHide(true));
	}, [videoId]);

	/** keep a loop running to update the current chord to display */
	useEffect(() => {
		if (shouldHide) return;
		let stop: boolean;

		function everyFrame() {
			// get all past keypoints
			const passedKeypoints = track.keypoints.filter(
				(k) => props.video.currentTime > k.at,
			);
			// the last keypoint is our new current one
			const nextCurrentKeypoint = passedKeypoints[passedKeypoints.length - 1];
			// sets, react doesn't re-render if is the same
			setCurrentKeypoint(nextCurrentKeypoint);
			// run again next frame
			if (!stop) requestAnimationFrame(everyFrame);
		}

		everyFrame();
		return () => {
			stop = true;
		};
	}, [track, shouldHide, props.video]);

	useEffect(() => {
		if (!currentSlotRef.current || !containerRef.current) return;
		// don't scroll=interrupt user when not looking to chords box
		if (!isElementInViewport(containerRef.current)) return;
		// don't scroll when user is hovering the chords box container
		if (isHoveringContainer) return;

		currentSlotRef.current.scrollIntoView({
			behavior: "smooth",
			block: "nearest",
			inline: "center",
		});
	}, [isHoveringContainer]);

	if (!import.meta.env.PROD) {
		useEffect(() => {
			props.video.volume = 0.5;
			props.video.focus();
		}, [props.video]);
	}

	if (shouldHide) return;

	return (
		<div
			ref={containerRef}
			onMouseEnter={() => setIsHoveringContainer(true)}
			onMouseLeave={() => setIsHoveringContainer(false)}
			className="px-4 py-2 mb-4!"
		>
			<div className="overflow-x-auto scrollbar-none flex items-center snap-mandatory gap-4">
				{track.keypoints.map((keypoint, i) => {
					const isCurrent = currentKeypoint === keypoint;

					return (
						<div
							key={keypoint.at}
							ref={isCurrent ? currentSlotRef : null}
							/* onClick={() => {
								props.video.currentTime = keypoint.at - 0.5;
								props.video.play();
							}} */
							className={cn(
								"snap-center cursor-pointer",
								!isCurrent && "duration-700 opacity-60",
							)}
						>
							{keypoint ? (
								<>
									<span className="mb-2! text-lg font-medium">
										{keypoint.ch.nm}
										{!import.meta.env.PROD && (
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
											: "bg-white/10 text-white/20",
									)}
								>
									{(i % 4) + 1}
								</div>
							)}
						</div>
					);
				})}
			</div>

			{/* Song Properties Small Text ------------- */}
			<div className="mt-2! text-[8px] opacity-20 gap-2 w-full flex items-center">
				<KeyValueText label="Transcriber">{track.meta.author}</KeyValueText>
				<KeyValueText label="Track KEY">
					{prettyNotation(track.meta.key || "NOT SPECIFIED")}
				</KeyValueText>
				<KeyValueText label="Track BPM">{track.meta.bpm}</KeyValueText>
			</div>
		</div>
	);
}

function isVideoPage() {
	// allow script to run when in preview.html
	if (isLocalServer()) return true;
	return location.href.includes("youtube.com/watch");
}

function inject() {
	const videoId = getThisYoutubeVideoID();
	if (!videoId || !isVideoPage()) return;

	log("info", "video id is", videoId);

	waitForSelector("#above-the-fold").then(async (titleContainer) => {
		document.removeEventListener("onClientNavigation", inject);
		log("debug", "title container found.");

		const id = "youtube-chords-container";
		let container = document.getElementById(id);

		// create our container if doesn't exists yet
		// added to avoid duplicated containers in dev page with hmr
		if (!container) {
			container = document.createElement("div");
			container.id = id;
			// insert before the youtube's title
			titleContainer.insertBefore(container, titleContainer.firstChild);
			log("debug", "new chord container was created.");
		}

		const video = await waitForSelector<HTMLVideoElement>("video");
		const track = await fetchTrackForID(videoId);

		render(
			<ChordsContainer
				initialTrack={track}
				initialVideoId={videoId}
				video={video}
			/>,
			container,
		);
	});
}

document.addEventListener("onClientNavigation", inject);

function onPageClientNavigation() {
	document.dispatchEvent(new Event("onClientNavigation"));
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
