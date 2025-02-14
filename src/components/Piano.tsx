import { cn } from "../tools";

const PATTERN = [
	[0, "C"],
	[1, "C#", "Db"],
	[0, "D"],
	[1, "D#", "Eb"],
	[0, "E"],
	[0, "F"],
	[1, "F#", "Gb"],
	[0, "G"],
	[1, "G#", "Ab"],
	[0, "A"],
	[1, "A#", "Ab"],
	[0, "B"],
] as const;

function Note(props: {
	kind: "black" | "white";
	pressed?: boolean;
	labels: string[];
}) {
	return (
		<div
			className={cn(
				"flex flex-col justify-end items-center rounded-b-[1px]",
				"transition-[background] duration-300 ease-out",
				props.kind === "white"
					? "w-[10px] h-[30px]"
					: "w-[6px] h-[20px] mx-[-3.5px]! pb-1 z-10",
				props.pressed
					? "bg-[#ff0033]!"
					: props.kind === "white"
						? "bg-white!"
						: "bg-black!",
			)}
		>
			{props.labels.map((label) => (
				<span
					key={label}
					className={cn(
						"font-medium",
						props.kind === "white"
							? "text-black text-[6px]"
							: "text-white/60 text-[2px]",
					)}
				>
					{label}
				</span>
			))}
		</div>
	);
}

const biggestReducer = (acc: number, curr: number) => Math.max(acc, curr);

export default function Piano({ pressedKeys }: { pressedKeys: number[] }) {
	const farthestNote = pressedKeys.reduce(biggestReducer, 0);
	const octavesNeeded = Math.ceil((farthestNote || 12) / 12);

	return (
		<div className="gap-[1px] flex w-fit">
			{Array.from({ length: octavesNeeded * 12 }, (_, i) => {
				const [black, ...label] = PATTERN[i % 12];

				return (
					<Note
						key={label}
						labels={label}
						kind={black ? "black" : "white"}
						pressed={pressedKeys?.includes(i)}
					/>
				);
			})}
		</div>
	);
}
