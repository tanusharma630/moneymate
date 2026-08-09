export const THEME_DARK = {
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

export const THEME_LIGHT = {
  bg: "#F4F6FB",
  surface: "#FFFFFF",
  surfaceRaised: "#F8FAFC",
  surfaceHi: "#EEF2F6",
  border: "rgba(0,0,0,0.08)",
  borderStrong: "rgba(0,0,0,0.16)",
  textPrimary: "#0F172A",
  textSecondary: "#475569",
  textTertiary: "#94A3B8",
  accent: "#6E7BF2",
  accent2: "#9C8CF9",
  accentSoft: "rgba(110,123,242,0.14)",
  accentLine: "rgba(110,123,242,0.35)",
  success: "#10B981",
  successSoft: "rgba(16,185,129,0.12)",
  danger: "#EF4444",
  dangerSoft: "rgba(239,68,68,0.12)",
  warning: "#F59E0B",
  warningSoft: "rgba(245,158,11,0.12)",
};

export const THEME = THEME_DARK;

export function getThemeColors(mode = "dark") {
  return mode === "light" ? THEME_LIGHT : THEME_DARK;
}

