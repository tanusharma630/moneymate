import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useDisclosure } from "@/hooks/useDisclosure";
import { profile } from "@/data/miscData";

const MENU_ITEMS = ["Profile", "Settings", "Log out"];

export default function ProfileMenu() {
  const { isOpen, toggle, close } = useDisclosure(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={toggle}
        aria-label="Profile menu"
        className="flex items-center gap-1.5 rounded-chip py-0.5 pl-0.5 pr-1.5"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-chip bg-gradient-to-br from-accent to-success text-xs font-semibold text-bg">
          {profile.initial}
        </div>
        <ChevronDown size={13} className="text-text-tertiary" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 z-20 mt-2 w-[160px] rounded-chip border border-border-strong bg-surface-raised p-1.5 shadow-elevate"
          >
            {MENU_ITEMS.map((label) => (
              <button
                key={label}
                type="button"
                onClick={close}
                className="w-full rounded-lg px-2.5 py-2 text-left text-xs text-text-secondary hover:bg-white/5"
              >
                {label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
