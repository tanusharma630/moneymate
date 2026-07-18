import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

/**
 * @param {Object} props
 * @param {number} props.pct - 0-100
 * @param {string} [props.colorClassName] - Tailwind bg-* class for the fill
 * @param {string} [props.className]
 */
export default function ProgressBar({ pct, colorClassName = "bg-accent", className }) {
  const clamped = Math.min(Math.max(pct, 0), 100);
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-border", className)}>
      <motion.div
        className={cn("h-full rounded-full", colorClassName)}
        initial={{ width: 0 }}
        animate={{ width: `${clamped}%` }}
        transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
      />
    </div>
  );
}
