import { cva } from "class-variance-authority";
import { cn } from "@/utils/cn";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9.5px] font-semibold tracking-wide",
  {
    variants: {
      tone: {
        accent: "bg-accent-soft text-accent",
        success: "bg-success-soft text-success",
        warning: "bg-warning-soft text-warning",
        danger: "bg-danger-soft text-danger",
        neutral: "bg-white/5 text-text-secondary",
      },
    },
    defaultVariants: {
      tone: "neutral",
    },
  }
);

/**
 * @param {Object} props
 * @param {"accent"|"success"|"warning"|"danger"|"neutral"} [props.tone]
 */
export default function Badge({ className, tone, children, ...props }) {
  return (
    <span className={cn(badgeVariants({ tone }), className)} {...props}>
      {children}
    </span>
  );
}
