import { cn } from "@/utils/cn";

/**
 * @param {Object} props
 * @param {string} props.label
 * @param {string} [props.error]
 * @param {React.ReactNode} props.children - the input element
 */
export default function FormField({ label, error, children }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[12px] font-medium text-text-secondary">{label}</span>
      {children}
      {error && <span className="text-[11px] text-danger">{error}</span>}
    </label>
  );
}

/**
 * Shared input styling so every field in the app looks the same without
 * repeating the same Tailwind string everywhere.
 * @param {Object} props
 * @param {boolean} [props.hasError]
 */
export function inputClassName({ hasError } = {}) {
  return cn(
    "rounded-chip border bg-surface px-3 py-2 text-[13px] text-text-primary outline-none transition-colors",
    "placeholder:text-text-tertiary focus:border-accent-line",
    hasError ? "border-danger" : "border-border"
  );
}
