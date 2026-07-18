import { cn } from "@/utils/cn";

/**
 * Consistent page-level heading used by every route (Income, Expenses, etc).
 * @param {Object} props
 * @param {string} props.title
 * @param {string} [props.description]
 * @param {React.ReactNode} [props.action]
 * @param {string} [props.className]
 */
export default function PageHeader({ title, description, action, className }) {
  return (
    <div className={cn("mb-6 flex flex-wrap items-start justify-between gap-4", className)}>
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-text-primary">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-[12.5px] text-text-tertiary">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
