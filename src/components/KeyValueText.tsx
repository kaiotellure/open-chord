import { PropsWithChildren } from "preact/compat";

export default function KeyValueText({
  label,
  children,
}: PropsWithChildren<{ label: string }>) {
  return (
    <span>
      {label}: <strong>{children}</strong>
    </span>
  );
}
