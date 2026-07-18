import { motion } from "framer-motion";
import { THEME } from "@/constants/theme";

/**
 * @param {Object} props
 * @param {number} props.pct - 0-100
 * @param {number} [props.size=64]
 * @param {number} [props.stroke=6]
 * @param {string} [props.color] - hex/rgba stroke color for the progress arc
 * @param {string} [props.trackColor]
 */
export default function ProgressRing({
  pct,
  size = 64,
  stroke = 6,
  color = THEME.accent,
  trackColor = THEME.border,
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(Math.max(pct, 0), 100);
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={trackColor}
        strokeWidth={stroke}
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </svg>
  );
}
