import { Calendar, ChevronDown, Search, Sun, Moon } from "lucide-react";
import MobileNav from "@/components/layout/MobileNav";
import QuickAddMenu from "@/components/layout/QuickAddMenu";
import NotificationsMenu from "@/components/layout/NotificationsMenu";
import ProfileMenu from "@/components/layout/ProfileMenu";
import { useAppContext } from "@/context/AppContext";

/**
 * Top bar shown on every page: greeting, search, date range, quick add,
 * notifications, and profile. Renders the mobile nav trigger on small screens.
 */
export default function Navbar() {
  const { dateRangeLabel, profile, openSearch, theme, toggleTheme } = useAppContext();

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <header className="flex items-center justify-between gap-4 border-b border-border px-6 py-5 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <MobileNav />
        <div className="min-w-0">
          <h1 className="truncate text-[19px] font-semibold tracking-tight text-text-primary">
            {greeting}, {profile.name}
          </h1>
          <p className="mt-0.5 text-[12.5px] text-text-tertiary">
            Here&apos;s what&apos;s happening with your money today.
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2.5">
        {/* Global Search Trigger */}
        <button
          type="button"
          onClick={openSearch}
          aria-label="Search transactions"
          className="hidden items-center gap-2 rounded-chip border border-border bg-surface px-3 py-1.5 text-[12.5px] text-text-tertiary transition-colors hover:border-border-strong hover:text-text-secondary md:flex w-[230px]"
        >
          <Search size={13} className="shrink-0" />
          <span className="flex-1 text-left">Search transactions...</span>
          <span className="mono shrink-0 rounded bg-surface-raised px-1.5 py-0.5 text-[10px]">
            ⌘K
          </span>
        </button>

        <button
          type="button"
          className="hidden items-center gap-1.5 rounded-chip border border-border bg-surface px-3 py-1.5 text-[12.5px] text-text-secondary sm:flex"
        >
          <Calendar size={13} className="text-text-tertiary" />
          {dateRangeLabel}
          <ChevronDown size={13} className="text-text-tertiary" />
        </button>

        {/* Theme Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="flex h-8 w-8 items-center justify-center rounded-chip border border-border bg-surface text-text-secondary transition-colors hover:border-border-strong"
        >
          {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
        </button>

        <QuickAddMenu />
        <NotificationsMenu />
        <ProfileMenu />
      </div>
    </header>
  );
}
