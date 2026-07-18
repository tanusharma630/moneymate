const PALETTE = [
  { bg: "rgba(110,123,242,0.16)", fg: "#6E7BF2" },
  { bg: "rgba(62,217,164,0.16)", fg: "#3ED9A4" },
  { bg: "rgba(240,182,94,0.16)", fg: "#F0B65E" },
  { bg: "rgba(255,107,122,0.16)", fg: "#FF6B7A" },
  { bg: "rgba(156,140,249,0.18)", fg: "#9C8CF9" },
];

/**
 * Deterministically maps a name to a color pair from the palette so the
 * same merchant always gets the same monogram color.
 * @param {string} name
 * @returns {{ bg: string, fg: string }}
 */
export function getMonogramStyle(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return PALETTE[Math.abs(hash) % PALETTE.length];
}
