/** "3 days ago" style relative time for commit dates. */
export function timeAgo(iso: string, now = Date.now()): string {
  const s = Math.max(0, (now - new Date(iso).getTime()) / 1000);
  const units: [number, string][] = [[31536000, "year"], [2592000, "month"], [86400, "day"], [3600, "hour"], [60, "minute"]];
  for (const [secs, name] of units) {
    if (s >= secs) {
      const n = Math.floor(s / secs);
      return `${n} ${name}${n > 1 ? "s" : ""} ago`;
    }
  }
  return "just now";
}

export const initials = (name: string) =>
  name
    .replace(/[^A-Za-z. ]/g, "")
    .split(/[ .]+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();

/** "March 2025 – Ongoing", tolerating a missing start or end. */
export function timelineLabel(t?: { start?: string; end?: string }): string | null {
  if (!t || (!t.start && !t.end)) return null;
  if (!t.start) return t.end!;
  return `${t.start} – ${t.end ?? "Present"}`;
}

/** "product · 2025", skipping whatever is not on record. */
export const projectEyebrow = (p: { category: string; year?: number }) => (p.year ? `${p.category} · ${p.year}` : p.category);
