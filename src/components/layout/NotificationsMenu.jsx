import { AnimatePresence, motion } from "framer-motion";
import { Bell, X, CheckCheck } from "lucide-react";
import { useDisclosure } from "@/hooks/useDisclosure";
import { useAppContext } from "@/context/AppContext";
import { cn } from "@/utils/cn";

const TONE_DOT = {
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
};

export default function NotificationsMenu() {
  const { notifications, unreadCount, markAllRead, readNotificationIds } = useAppContext();
  const { isOpen, toggle, close } = useDisclosure(false);

  const handleOpen = () => {
    toggle();
  };

  const handleMarkAllRead = () => {
    markAllRead();
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleOpen}
        aria-label="Notifications"
        className="relative flex h-8 w-8 items-center justify-center rounded-chip border border-border bg-surface"
      >
        <Bell size={14} className="text-text-secondary" />
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-accent text-[8px] font-bold text-bg">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={close} />
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 z-20 mt-2 w-[300px] rounded-chip border border-border-strong bg-surface-raised p-2 shadow-elevate"
            >
              <div className="flex items-center justify-between px-2 py-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-text-primary">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-bg">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={handleMarkAllRead}
                      aria-label="Mark all read"
                      className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] text-text-tertiary hover:bg-white/5 hover:text-text-secondary"
                    >
                      <CheckCheck size={11} />
                      Mark all read
                    </button>
                  )}
                  <button type="button" onClick={close} aria-label="Close notifications">
                    <X size={13} className="text-text-tertiary" />
                  </button>
                </div>
              </div>

              {notifications.length === 0 ? (
                <div className="py-6 text-center text-[12px] text-text-tertiary">
                  No notifications yet
                </div>
              ) : (
                <div className="max-h-[300px] overflow-y-auto">
                  {notifications.map((n, i) => {
                    const isUnread = !readNotificationIds.has(n.id);
                    return (
                      <div
                        key={n.id}
                        className={cn(
                          "flex items-start gap-2 rounded-lg px-2 py-2 transition-colors",
                          i !== 0 && "border-t border-border",
                          isUnread && "bg-accent/[0.04]"
                        )}
                      >
                        <span className={cn("mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full", TONE_DOT[n.tone])} />
                        <div className="min-w-0 flex-1">
                          <div className="text-[11.5px] leading-snug text-text-primary">{n.text}</div>
                          <div className="mt-0.5 text-[10px] text-text-tertiary">{n.time}</div>
                        </div>
                        {isUnread && (
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
