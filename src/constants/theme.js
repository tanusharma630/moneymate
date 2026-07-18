/**
 * Mirrors the palette defined in tailwind.config.js.
 * Charts (Recharts/SVG) need literal hex values rather than Tailwind class
 * names, so this is the single source of truth both files pull from.
 */
export const THEME = {
  bg: "#0B1020",
  surface: "#10162A",
  surfaceRaised: "#141B31",
  surfaceHi: "#171F3A",
  border: "rgba(255,255,255,0.07)",
  borderStrong: "rgba(255,255,255,0.14)",
  textPrimary: "#E8EAF4",
  textSecondary: "#8B92AB",
  textTertiary: "#565D75",
  accent: "#6E7BF2",
  accent2: "#9C8CF9",
  accentSoft: "rgba(110,123,242,0.14)",
  accentLine: "rgba(110,123,242,0.35)",
  success: "#3ED9A4",
  successSoft: "rgba(62,217,164,0.12)",
  danger: "#FF6B7A",
  dangerSoft: "rgba(255,107,122,0.12)",
  warning: "#F0B65E",
  warningSoft: "rgba(240,182,94,0.12)",
};
