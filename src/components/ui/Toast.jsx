import { useAppContext } from "@/context/AppContext";
import { AnimatePresence, motion } from "framer-motion";
import { Check, AlertCircle } from "lucide-react";

/**
 * Toast alert notifier widget shown at the bottom-right corner.
 * Features an ease-out spring entrance and sliding dismissal animation.
 */
export default function Toast() {
  const { toast } = useAppContext();

  return (
    <AnimatePresence>
      {toast && toast.show && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-chip border border-border-strong bg-surface-raised/95 px-4.5 py-3.5 shadow-glow backdrop-blur-md"
        >
          {toast.type === "success" ? (
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success-soft">
              <Check size={12} className="text-success" />
            </div>
          ) : (
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-danger-soft">
              <AlertCircle size={12} className="text-danger" />
            </div>
          )}
          <span className="text-[12.5px] font-medium text-text-primary leading-none">
            {toast.message}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
