import { cn } from "../tools";

const PATTERN = [
  [0, "C"],
  [1],
  [0, "D"],
  [1],
  [0, "E"],
  [0, "F"],
  [1],
  [0, "G"],
  [1],
  [0, "A"],
  [1],
  [0, "B"],
] as const;

function Note({
  kind,
  pressed,
  label,
}: {
  kind: "black" | "white";
  pressed?: boolean;
  label?: any;
}) {
  return (
    <div
    className={cn(
      pressed
          ? "bg-[#ff0033]!"
          : kind == "white"
          ? "bg-white!"
          : "bg-black!"
    )}
      style={{
        transition: "background 300ms ease-out",
        
        width: kind == "white" ? 10 : 5,
        height: kind == "white" ? 30 : 20,
        marginInline: kind == "white" ? null : -3,
        zIndex: kind == "white" ? null : 10,
        borderBottomRightRadius: kind == "white" ? 1 : 2,
        borderBottomLeftRadius: kind == "white" ? 1 : 2,
        display: "flex",
        justifyContent: "center",
        alignItems: "end",
        paddingBlock: 2,
      }}
    >
      {kind == "white" && (
        <span
          style={{
            fontWeight: "600",
            lineHeight: 1,
            fontSize: 4,
            color: "black",
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
}

const biggestReducer = (acc: number, curr: number) => Math.max(acc, curr);

export default function Piano({ pressedKeys }: { pressedKeys?: number[] }) {
  const farthestNote = pressedKeys?.reduce(biggestReducer, 0);
  const octavesNeeded = Math.ceil((farthestNote || 12) / 12);

  return (
    <div
      style={{
        // background: "rgb(20,20,20,.8)",
        gap: 1,
        display: "flex",
        width: "fit-content",
      }}
    >
      {Array(octavesNeeded * 12)
        .fill(0)
        .map((_, i) => {
          const [black, label] = PATTERN[i % 12];
          return (
            <Note
              label={label}
              kind={black ? "black" : "white"}
              pressed={pressedKeys && pressedKeys.includes(i)}
            />
          );
        })}
    </div>
  );
}
