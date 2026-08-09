import Button from "@/components/ui/Button";

/**
 * @param {Object} props
 * @param {import('lucide-react').LucideIcon} props.icon
 * @param {string} props.title
 * @param {string} props.subtitle
 * @param {string} [props.actionLabel]
 * @param {() => void} [props.onAction]
 */
export default function EmptyState({ icon: Icon, title, subtitle, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-10 text-center">
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-chip border border-border bg-surface-raised">
        <Icon size={18} className="text-text-tertiary" />
      </div>
      <p className="text-sm font-medium text-text-primary">{title}</p>
      <p className="mt-1 max-w-[280px] text-[11.5px] text-text-tertiary">{subtitle}</p>
      {actionLabel && (
        <Button variant="soft" size="sm" className="mt-4" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
