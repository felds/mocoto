export function msToDuration(ms: number | null): string {
  if (!ms) {
    return "♾️ live";
  }

  const ss = ms / 1000;
  const s = String(ss % 60 >> 0).padStart(2, "0");
  const m = String(((ss % 3600) / 60) >> 0).padStart(2, "0");
  const h = String((ss / 3600) >> 0).padStart(2, "0");

  return `${h}:${m}:${s}`;
}
