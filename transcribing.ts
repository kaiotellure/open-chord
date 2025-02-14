import { chord, prettyNotation } from "./src/chords";
import type { TrackApiResponse, TrackKeypoint } from "./src/types";

export const videoId = "SMDJ6_ftXV8";

function repeat(at: number, ...chords: TrackKeypoint[]) {
	return chords.map((chord, i) => {
		return {
			at: Number((at + (i === 0 ? 0 : chord.at - chords[0].at)).toFixed(2)),
			ch: chord.ch,
		};
	});
}

export const myTranscription: TrackApiResponse = {
	meta: {
		bpm: 97,
		key: prettyNotation("E"),
		author: "@kaiotellure",
	},
	keypoints: [
		{ at: 0.34, ch: chord("C#", "minor") },
		{ at: 1.52, ch: chord("F#", "minor") },
		{ at: 2.76, ch: chord("B", "minor") },
		{ at: 4.04, ch: chord("E", "major") },
		...repeat(
			5.34,
			{ at: 0.34, ch: chord("C#", "minor_seventh") },
			{ at: 1.52, ch: chord("F#", "minor") },
			{ at: 2.76, ch: chord("B", "minor_seventh") },
			{ at: 4.04, ch: chord("E", "major") },
		),
		...repeat(
			10.27,
			{ at: 0.34, ch: chord("C#", "minor") },
			{ at: 1.52, ch: chord("F#", "minor") },
			{ at: 2.76, ch: chord("B", "minor_seventh") },
			{ at: 4.04, ch: chord("E", "major") },
		),
		...repeat(
			15.36,
			{ at: 0.34, ch: chord("C#", "minor_seventh") },
			{ at: 1.52, ch: chord("F#", "minor") },
			{ at: 2.76, ch: chord("B", "minor_seventh") },
			{ at: 4.04, ch: chord("E", "major") },
		),
		{ at: 20.32, ch: chord("D", "major_seventh") },
		{ at: 22.83, ch: chord("C#", "minor_seventh") },
		{ at: 24.65, ch: chord("F#", "minor") },
		{ at: 25.34, ch: chord("B", "minor_seventh") },
		{ at: 27.81, ch: chord("E", "major") },
		{ at: 29.06, ch: chord("A", "major_seventh") },
		...repeat(
			30.36,
			{ at: 20.32, ch: chord("D", "major_seventh") },
			{ at: 22.83, ch: chord("C#", "minor_seventh") },
			{ at: 24.65, ch: chord("F#", "minor") },
			{ at: 25.34, ch: chord("B", "minor_seventh") },
			{ at: 27.81, ch: chord("E", "major") },
		),
		{ at: 39.06, ch: chord("A", "major") },
		{ at: 40.36, ch: chord("D", "major_seventh") },
		{ at: 42.75, ch: chord("C#", "minor_seventh") },
		{ at: 45.35, ch: chord("B", "minor_seventh") },
		{ at: 47.89, ch: chord("E", "major") },
		{ at: 49.01, ch: chord("A", "major") },
		...repeat(
			50.35,
			{ at: 20.32, ch: chord("D", "major_seventh") },
			{ at: 22.83, ch: chord("C#", "minor_seventh") },
			{ at: 24.65, ch: chord("F#", "minor") },
			{ at: 25.34, ch: chord("B", "minor_seventh") },
			{ at: 27.81, ch: chord("E", "major") },
		),
		{ at: 59.06, ch: chord("A", "major") },
		...repeat(
			60.33,
			{ at: 0.34, ch: chord("C#", "minor") },
			{ at: 1.52, ch: chord("F#", "minor") },
			{ at: 2.76, ch: chord("B", "minor_seventh") },
			{ at: 4.04, ch: chord("E", "major") },
		),
		...repeat(
			65.32,
			{ at: 0.34, ch: chord("C#", "minor_seventh") },
			{ at: 1.52, ch: chord("F#", "minor") },
			{ at: 2.76, ch: chord("B", "minor_seventh") },
			{ at: 4.04, ch: chord("E", "major") },
		),

		...repeat(
			70.32,
			{ at: 0.34, ch: chord("C#", "minor") },
			{ at: 1.52, ch: chord("F#", "minor") },
			{ at: 2.76, ch: chord("B", "minor_seventh") },
			{ at: 4.04, ch: chord("E", "major") },
		),

		...repeat(
			75.4,
			{ at: 0.34, ch: chord("C#", "minor_seventh") },
			{ at: 1.52, ch: chord("F#", "minor") },
			{ at: 2.76, ch: chord("B", "minor_seventh") },
			{ at: 4.04, ch: chord("E", "major") },
		),

		...repeat(
			80.33,
			{ at: 0.34, ch: chord("C#", "minor") },
			{ at: 1.52, ch: chord("F#", "minor") },
			{ at: 2.76, ch: chord("B", "minor_seventh") },
			{ at: 4.04, ch: chord("E", "major") },
		),

		...repeat(
			85.32,
			{ at: 0.34, ch: chord("C#", "minor_seventh") },
			{ at: 1.52, ch: chord("F#", "minor") },
			{ at: 2.76, ch: chord("B", "minor_seventh") },
			{ at: 4.04, ch: chord("E", "major") },
		),

		...repeat(
			90.4,
			{ at: 0.34, ch: chord("C#", "minor") },
			{ at: 1.52, ch: chord("F#", "minor") },
			{ at: 2.76, ch: chord("B", "minor_seventh") },
			{ at: 4.04, ch: chord("E", "major") },
		),

		...repeat(
			95.38,
			{ at: 0.34, ch: chord("C#", "minor_seventh") },
			{ at: 1.52, ch: chord("F#", "minor") },
			{ at: 2.76, ch: chord("B", "minor") },
			{ at: 4.04, ch: chord("E", "major") },
		),

		...repeat(
			100.42,
			{ at: 0.34, ch: chord("C#", "minor") },
			{ at: 1.52, ch: chord("F#", "minor") },
			{ at: 2.76, ch: chord("B", "minor") },
			{ at: 4.04, ch: chord("E", "major") },
		),
		...repeat(
			105.35,
			{ at: 0.34, ch: chord("C#", "minor") },
			{ at: 1.52, ch: chord("F#", "minor") },
			{ at: 2.76, ch: chord("B", "minor") },
			{ at: 4.04, ch: chord("E", "major") },
		),
		...repeat(
			110.33,
			{ at: 0.34, ch: chord("C#", "minor") },
			{ at: 1.52, ch: chord("F#", "minor") },
			{ at: 2.76, ch: chord("B", "minor_seventh") },
			{ at: 4.04, ch: chord("E", "major") },
		),

		...repeat(
			115.34,
			{ at: 0.34, ch: chord("C#", "minor_seventh") },
			{ at: 1.52, ch: chord("F#", "minor") },
			{ at: 2.76, ch: chord("B", "minor_seventh") },
			{ at: 4.04, ch: chord("E", "major") },
		),

		...repeat(
			120.35,
			{ at: 20.32, ch: chord("D", "major_seventh") },
			{ at: 22.83, ch: chord("C#", "minor_seventh") },
			{ at: 24.65, ch: chord("F#", "minor") },
			{ at: 25.34, ch: chord("B", "minor_seventh") },
			{ at: 27.81, ch: chord("E", "major") },
		),
		{ at: 129.1, ch: chord("A", "major") },

		...repeat(
			130.56,
			{ at: 20.32, ch: chord("D", "major_seventh") },
			{ at: 22.83, ch: chord("C#", "minor_seventh") },
			{ at: 24.65, ch: chord("F#", "minor") },
			{ at: 25.34, ch: chord("B", "minor_seventh") },
			{ at: 27.81, ch: chord("E", "major") },
		),
		{ at: 139.1, ch: chord("A", "major") },
		...repeat(
			140.34,
			{ at: 20.32, ch: chord("D", "major_seventh") },
			{ at: 22.83, ch: chord("C#", "minor_seventh") },
			{ at: 25.34, ch: chord("B", "minor_seventh") },
			{ at: 27.81, ch: chord("E", "major") },
		),
		{ at: 149.07, ch: chord("A", "major_seventh") },
		...repeat(
			150.36,
			{ at: 20.32, ch: chord("D", "major_seventh") },
			{ at: 22.83, ch: chord("C#", "minor_seventh") },
			{ at: 24.65, ch: chord("F#", "minor_seventh") },
			{ at: 25.34, ch: chord("B", "minor_seventh") },
			{ at: 27.81, ch: chord("E", "major") },
		),
		{ at: 159.15, ch: chord("A", "major") },

		...repeat(
			160.42,
			{ at: 0.34, ch: chord("C#", "minor") },
			{ at: 1.52, ch: chord("F#", "minor") },
			{ at: 2.76, ch: chord("B", "minor") },
			{ at: 4.04, ch: chord("E", "major") },
		),

		...repeat(
			165.39,
			{ at: 0.34, ch: chord("C#", "minor_seventh") },
			{ at: 1.52, ch: chord("F#", "minor") },
			{ at: 2.76, ch: chord("B", "minor_seventh") },
			{ at: 4.04, ch: chord("E", "major") },
		),

		...repeat(
			170.39,
			{ at: 0.34, ch: chord("C#", "minor") },
			{ at: 1.52, ch: chord("F#", "minor") },
			{ at: 2.76, ch: chord("B", "minor_seventh") },
			{ at: 4.04, ch: chord("E", "major") },
		),
	],
};

if (typeof window === "undefined" && !import.meta.env.PROD) {
	const fs = await import("node:fs");

	fs.writeFileSync(`./docs/${videoId}.json`, JSON.stringify(myTranscription));
}
