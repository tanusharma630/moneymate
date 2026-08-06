import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, User, Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDisclosure } from "@/hooks/useDisclosure";
import { useAppContext } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";

const MENU_ITEMS = [
  { label: "Profile", icon: User, action: "profile" },
  { label: "Settings", icon: Settings, action: "settings" },
  { label: "Log out", icon: LogOut, action: "logout", danger: true },
];

export default function ProfileMenu() {
  const { isOpen, toggle, close } = useDisclosure(false);
  const { profile, showToast } = useAppContext();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const activeName = user?.name || profile?.name || "Anvi Sharma";
  const activeEmail = user?.email || profile?.email || "anvi@example.com";
  const activeInitial = user?.initial || profile?.initial || "AS";

  const handleAction = (action) => {
    close();
    if (action === "profile" || action === "settings") {
      navigate("/settings");
    } else if (action === "logout") {
      logout();
      showToast("You've been logged out successfully.", "success");
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={toggle}
        aria-label="Profile menu"
        className="flex items-center gap-1.5 rounded-chip py-0.5 pl-0.5 pr-1.5"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-chip bg-gradient-to-br from-accent to-success text-xs font-semibold text-bg">
          {activeInitial}
        </div>
        <ChevronDown size={13} className="text-text-tertiary" />
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
              className="absolute right-0 z-20 mt-2 w-[200px] rounded-chip border border-border-strong bg-surface-raised p-1.5 shadow-elevate"
            >
              {/* Profile header */}
              <div className="px-2.5 py-2 border-b border-border mb-1">
                <div className="text-[11.5px] font-semibold text-text-primary truncate">{activeName}</div>
                <div className="text-[10.5px] text-text-tertiary truncate">{activeEmail}</div>
              </div>

              {MENU_ITEMS.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleAction(item.action)}
                  className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-medium transition-colors ${
                    item.danger
                      ? "text-danger hover:bg-danger/10"
                      : "text-text-secondary hover:bg-white/5 hover:text-text-primary"
                  }`}
                >
                  <item.icon size={12} />
                  {item.label}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

