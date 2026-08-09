import { forwardRef } from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 rounded-chip font-medium transition-transform duration-150 active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary: "bg-accent text-bg hover:bg-accent/90",
        soft: "bg-accent-soft text-accent hover:bg-accent-soft/80",
        outline: "border border-border bg-surface text-text-secondary hover:border-border-strong",
        ghost: "text-text-secondary hover:bg-white/5",
      },
      size: {
        sm: "px-2.5 py-1.5 text-xs",
        md: "px-3 py-2 text-sm",
        icon: "w-8 h-8",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

/**
 * @param {Object} props
 * @param {"primary"|"soft"|"outline"|"ghost"} [props.variant]
 * @param {"sm"|"md"|"icon"} [props.size]
 */
const Button = forwardRef(function Button(
  { className, variant, size, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
});

export default Button;
