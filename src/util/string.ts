export function msToDuration(ms: number | null): string {
  if (!ms) {
    return "♾️ live";
  }
  const date = new Date(ms);
  const HH = `${date.getUTCHours()}`.padStart(2, "0");
  const MM = `${date.getUTCMinutes()}`.padStart(2, "0");
  const SS = `${date.getUTCSeconds()}`.padStart(2, "0");

  return `${HH}:${MM}:${SS}`;
}
