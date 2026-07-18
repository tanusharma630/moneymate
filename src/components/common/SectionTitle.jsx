import { cn } from "@/utils/cn";

/**
 * @param {Object} props
 * @param {string} props.title
 * @param {string} [props.subtitle]
 * @param {React.ReactNode} [props.action] - element rendered on the right (link, toggle, etc.)
 * @param {string} [props.className]
 */
export default function SectionTitle({ title, subtitle, action, className }) {
  return (
    <div className={cn("mb-4 flex items-start justify-between gap-3", className)}>
      <div>
        <h3 className="text-base font-semibold text-text-primary">{title}</h3>
        {subtitle && (
          <p className="mt-0.5 text-[11.5px] text-text-tertiary">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}
