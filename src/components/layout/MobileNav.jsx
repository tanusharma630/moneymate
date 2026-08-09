import { AnimatePresence, motion } from "framer-motion";
import { X, Menu } from "lucide-react";
import LogoMark from "@/components/common/LogoMark";
import SidebarItem from "@/components/layout/SidebarItem";
import ProfileSummaryCard from "@/components/layout/ProfileSummaryCard";
import { NAV_ITEMS, SETTINGS_NAV_ITEM } from "@/constants/nav";
import { useDisclosure } from "@/hooks/useDisclosure";

/**
 * Hamburger trigger (rendered in the Navbar on small screens) plus the
 * slide-in drawer it opens. Self-contained so Navbar doesn't need to manage
 * drawer state.
 */
export default function MobileNav() {
  const { isOpen, open, close } = useDisclosure(false);

  return (
    <>
      <button
        type="button"
        onClick={open}
        aria-label="Open navigation menu"
        className="flex h-8 w-8 items-center justify-center rounded-chip border border-border bg-surface lg:hidden"
      >
        <Menu size={16} className="text-text-secondary" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/60 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-bg px-4 py-6 lg:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
            >
              <div className="mb-8 flex items-center justify-between px-2">
                <div className="flex items-center gap-2.5">
                  <LogoMark size={28} />
                  <span className="text-[14.5px] font-semibold tracking-tight text-text-primary">
                    MoneyMate
                  </span>
                </div>
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close navigation menu"
                  className="flex h-7 w-7 items-center justify-center rounded-chip text-text-tertiary hover:bg-white/5"
                >
                  <X size={15} />
                </button>
              </div>

              <nav className="flex flex-col gap-1">
                {NAV_ITEMS.map((item) => (
                  <SidebarItem
                    key={item.path}
                    to={item.path}
                    icon={item.icon}
                    label={item.label}
                    onNavigate={close}
                  />
                ))}
              </nav>

              <div className="mt-auto flex flex-col gap-3">
                <SidebarItem
                  to={SETTINGS_NAV_ITEM.path}
                  icon={SETTINGS_NAV_ITEM.icon}
                  label={SETTINGS_NAV_ITEM.label}
                  onNavigate={close}
                />
                <div className="h-px bg-border" />
                <ProfileSummaryCard />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
