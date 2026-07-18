import { AnimatePresence, motion } from "framer-motion";
import { Bell, X } from "lucide-react";
import { useDisclosure } from "@/hooks/useDisclosure";
import { notifications } from "@/data/miscData";
import { cn } from "@/utils/cn";

const TONE_DOT = {
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
};

export default function NotificationsMenu() {
  const { isOpen, toggle, close } = useDisclosure(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={toggle}
        aria-label="Notifications"
        className="relative flex h-8 w-8 items-center justify-center rounded-chip border border-border bg-surface"
      >
        <Bell size={14} className="text-text-secondary" />
        <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-accent" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 z-20 mt-2 w-[280px] rounded-chip border border-border-strong bg-surface-raised p-2 shadow-elevate"
          >
            <div className="flex items-center justify-between px-2 py-1.5">
              <span className="text-xs font-semibold text-text-primary">Notifications</span>
              <button type="button" onClick={close} aria-label="Close notifications">
                <X size={13} className="text-text-tertiary" />
              </button>
            </div>
            {notifications.map((n, i) => (
              <div
                key={n.id}
                className={cn(
                  "flex items-start gap-2 rounded-lg px-2 py-2",
                  i !== 0 && "border-t border-border"
                )}
              >
                <span className={cn("mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full", TONE_DOT[n.tone])} />
                <div>
                  <div className="text-[11.5px] leading-snug text-text-primary">{n.text}</div>
                  <div className="mt-0.5 text-[10px] text-text-tertiary">{n.time}</div>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
