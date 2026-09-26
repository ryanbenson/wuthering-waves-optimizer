// Pure helpers that shape scanner analytics payloads (see docs/scanner.md's
// "Usage analytics"). Kept out of useEchoScanner so they can be unit-tested.
import type { FrameSize } from "./types";

const COMMON_RATIOS: { label: string; value: number }[] = [
  { label: "4:3", value: 4 / 3 },
  { label: "3:2", value: 3 / 2 },
  { label: "16:10", value: 16 / 10 },
  { label: "16:9", value: 16 / 9 },
  { label: "21:9", value: 64 / 27 },
  { label: "32:9", value: 32 / 9 },
];

const RATIO_TOLERANCE = 0.03;
const MAX_MESSAGE_LENGTH = 120;

/** Nearest common display ratio ("16:9", "21:9", …), "portrait" for tall frames, or "other". */
export function ratioLabel(frame: FrameSize): string {
  const aspect = frame.width / frame.height;
  if (aspect < 1) return "portrait";
  const match = COMMON_RATIOS.find((r) => Math.abs(aspect - r.value) < RATIO_TOLERANCE);
  return match?.label ?? "other";
}

export function describeAspect(frame: FrameSize) {
  return {
    aspect: (frame.width / frame.height).toFixed(2),
    ratio: ratioLabel(frame),
    resolution: `${frame.width}x${frame.height}`,
  };
}

/**
 * High-level error summary: `error` is the Error/DOMException name (or the
 * kind of non-Error value thrown), `message` a truncated message. Our own
 * throws are all plain `Error`s, so the message is what tells them apart.
 */
export function describeError(err: unknown): { error: string; message: string | null } {
  if (err instanceof Error) {
    return { error: err.name || "Error", message: truncate(err.message) };
  }
  if (typeof err === "string") {
    return { error: "string", message: truncate(err) };
  }
  if (err && typeof err === "object") {
    // Older Safari DOMExceptions aren't `instanceof Error`; worker/media
    // failures can surface as bare Events.
    const obj = err as { name?: unknown; message?: unknown; type?: unknown };
    const name =
      typeof obj.name === "string" && obj.name
        ? obj.name
        : typeof obj.type === "string"
          ? `Event:${obj.type}`
          : (err.constructor?.name ?? "object");
    return { error: name, message: typeof obj.message === "string" ? truncate(obj.message) : null };
  }
  return { error: typeof err, message: null };
}

function truncate(message: string): string | null {
  const trimmed = message.trim();
  if (!trimmed) return null;
  return trimmed.length > MAX_MESSAGE_LENGTH ? `${trimmed.slice(0, MAX_MESSAGE_LENGTH - 1)}…` : trimmed;
}
