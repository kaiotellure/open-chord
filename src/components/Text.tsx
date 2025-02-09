import { PropsWithChildren } from "preact/compat";

export function Text({
  children,
  size,
}: PropsWithChildren<{ size?: string | number }>) {
  return <span style={{ fontSize: size || "1em" }}>{children}</span>;
}
