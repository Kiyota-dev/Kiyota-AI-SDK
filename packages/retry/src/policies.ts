export type BackoffPolicy = "fixed" | "exponential" | "linear";

export function calculateDelay(
  attempt: number,
  baseDelayMs: number,
  backoff: BackoffPolicy,
  jitter: boolean,
): number {
  let delay: number;

  switch (backoff) {
    case "linear":
      delay = baseDelayMs * attempt;
      break;
    case "exponential":
      delay = baseDelayMs * 2 ** attempt;
      break;
    default:
      delay = baseDelayMs;
      break;
  }

  if (jitter) {
    delay = delay * (0.5 + Math.random() * 0.5);
  }

  return Math.round(delay);
}
