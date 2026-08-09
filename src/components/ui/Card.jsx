import { forwardRef } from "react";
import { cn } from "@/utils/cn";

/**
 * Base surface for every widget in the app. Adds a subtle lift + shadow on
 * hover; pass `glow` for the accent-tinted shadow used by hero cards like
 * the MoneyMate Coach.
 *
 * @param {Object} props
 * @param {boolean} [props.glow] - use accent-colored hover shadow instead of neutral
 * @param {boolean} [props.padded=true] - apply default padding
 */
const Card = forwardRef(function Card(
  { className, glow = false, padded = true, children, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-card border border-border bg-surface transition-all duration-200",
        "hover:border-border-strong hover:-translate-y-0.5",
        glow ? "hover:shadow-glow" : "hover:shadow-elevate",
        padded && "p-5",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

export default Card;
