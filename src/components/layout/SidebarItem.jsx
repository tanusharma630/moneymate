import { NavLink } from "react-router-dom";
import { cn } from "@/utils/cn";

/**
 * @param {Object} props
 * @param {string} props.to
 * @param {import('lucide-react').LucideIcon} props.icon
 * @param {string} props.label
 * @param {() => void} [props.onNavigate] - called after navigation, e.g. to close mobile drawer
 */
export default function SidebarItem({ to, icon: Icon, label, onNavigate }) {
  return (
    <NavLink
      to={to}
      end={to === "/"}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          "relative flex items-center gap-3 rounded-card px-3 py-2.5 text-left transition-colors duration-200",
          isActive ? "bg-accent-soft" : "hover:bg-white/[0.035]"
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <span className="absolute left-0 top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-full bg-accent" />
          )}
          <Icon
            size={15}
            strokeWidth={2}
            className={isActive ? "text-accent" : "text-text-tertiary"}
          />
          <span
            className={cn(
              "text-[13px]",
              isActive ? "font-semibold text-text-primary" : "font-normal text-text-secondary"
            )}
          >
            {label}
          </span>
        </>
      )}
    </NavLink>
  );
}
