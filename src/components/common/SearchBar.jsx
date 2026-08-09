import { Search } from "lucide-react";
import { cn } from "@/utils/cn";

/**
 * @param {Object} props
 * @param {string} [props.placeholder]
 * @param {string} [props.value]
 * @param {(value: string) => void} [props.onChange]
 * @param {string} [props.shortcut] - e.g. "⌘K", rendered as a hint chip
 * @param {string} [props.className]
 */
export default function SearchBar({
  placeholder = "Search...",
  value,
  onChange,
  shortcut,
  className,
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-chip border border-border bg-surface px-3 py-1.5",
        className
      )}
    >
      <Search size={14} className="text-text-tertiary shrink-0" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-[12.5px] text-text-primary placeholder:text-text-tertiary outline-none"
      />
      {shortcut && (
        <span className="mono shrink-0 rounded bg-surface-raised px-1.5 py-0.5 text-[10px] text-text-tertiary">
          {shortcut}
        </span>
      )}
    </div>
  );
}
