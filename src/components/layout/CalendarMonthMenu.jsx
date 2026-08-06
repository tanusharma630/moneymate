import { AnimatePresence, motion } from "framer-motion";
import { Calendar, ChevronDown, Check } from "lucide-react";
import { useDisclosure } from "@/hooks/useDisclosure";
import { useAppContext } from "@/context/AppContext";

const MONTH_OPTIONS = [
  "All Time",
  "January 2026",
  "February 2026",
  "March 2026",
  "April 2026",
  "May 2026",
  "June 2026",
  "July 2026",
  "August 2026",
  "September 2026",
  "October 2026",
  "November 2026",
  "December 2026",
];

export default function CalendarMonthMenu() {
  const { isOpen, toggle, close } = useDisclosure(false);
  const { dateRangeLabel, setDateRangeLabel } = useAppContext();

  const handleSelect = (label) => {
    setDateRangeLabel(label);
    close();
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={toggle}
        aria-label="Select date range"
        className="hidden items-center gap-1.5 rounded-chip border border-border bg-surface px-3 py-1.5 text-[12.5px] font-medium text-text-secondary transition-colors hover:border-border-strong sm:flex"
      >
        <Calendar size={13} className="text-text-tertiary" />
        <span>{dateRangeLabel}</span>
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
              className="absolute right-0 z-20 mt-2 max-h-[300px] w-[180px] overflow-y-auto rounded-chip border border-border-strong bg-surface-raised p-1 shadow-elevate no-scrollbar"
            >
              <div className="px-2.5 py-1.5 text-[10.5px] font-semibold text-text-tertiary uppercase tracking-wider border-b border-border mb-1">
                Select Period
              </div>

              {MONTH_OPTIONS.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => handleSelect(m)}
                  className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs font-medium transition-colors ${
                    dateRangeLabel === m
                      ? "bg-accent-soft text-accent"
                      : "text-text-secondary hover:bg-surface-hi hover:text-text-primary"
                  }`}
                >
                  <span>{m}</span>
                  {dateRangeLabel === m && <Check size={13} className="text-accent" />}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
