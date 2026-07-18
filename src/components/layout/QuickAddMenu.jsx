import { AnimatePresence, motion } from "framer-motion";
import { Plus, ArrowUpRight, ArrowDownRight, Target } from "lucide-react";
import Button from "@/components/ui/Button";
import { useDisclosure } from "@/hooks/useDisclosure";

const ACTIONS = [
  { icon: ArrowUpRight, label: "Add Income" },
  { icon: ArrowDownRight, label: "Add Expense" },
  { icon: Target, label: "Add Goal" },
];

export default function QuickAddMenu() {
  const { isOpen, toggle, close } = useDisclosure(false);

  return (
    <div className="relative">
      <Button variant="primary" size="sm" onClick={toggle} className="hidden sm:inline-flex">
        <Plus size={13} /> Quick Add
      </Button>
      <Button variant="primary" size="icon" onClick={toggle} aria-label="Quick add" className="sm:hidden">
        <Plus size={15} />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 z-20 mt-2 w-[170px] rounded-chip border border-border-strong bg-surface-raised p-1.5 shadow-elevate"
          >
            {ACTIONS.map((a) => (
              <button
                key={a.label}
                type="button"
                onClick={close}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs text-text-secondary hover:bg-white/5"
              >
                <a.icon size={12} /> {a.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
