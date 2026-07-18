import { Calendar, ChevronDown } from "lucide-react";
import MobileNav from "@/components/layout/MobileNav";
import QuickAddMenu from "@/components/layout/QuickAddMenu";
import NotificationsMenu from "@/components/layout/NotificationsMenu";
import ProfileMenu from "@/components/layout/ProfileMenu";
import SearchBar from "@/components/common/SearchBar";
import { useAppContext } from "@/context/AppContext";
import { profile } from "@/data/miscData";

/**
 * Top bar shown on every page: greeting, search, date range, quick add,
 * notifications, and profile. Renders the mobile nav trigger on small screens.
 */
export default function Navbar() {
  const { dateRangeLabel } = useAppContext();

  return (
    <header className="flex items-center justify-between gap-4 border-b border-border px-6 py-5 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <MobileNav />
        <div className="min-w-0">
          <h1 className="truncate text-[19px] font-semibold tracking-tight text-text-primary">
            Good evening, {profile.name}
          </h1>
          <p className="mt-0.5 text-[12.5px] text-text-tertiary">
            Here&apos;s what&apos;s happening with your money today.
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2.5">
        <SearchBar
          placeholder="Search transactions..."
          shortcut="⌘K"
          className="hidden w-[230px] md:flex"
        />

        <button
          type="button"
          className="hidden items-center gap-1.5 rounded-chip border border-border bg-surface px-3 py-1.5 text-[12.5px] text-text-secondary sm:flex"
        >
          <Calendar size={13} className="text-text-tertiary" />
          {dateRangeLabel}
          <ChevronDown size={13} className="text-text-tertiary" />
        </button>

        <QuickAddMenu />
        <NotificationsMenu />
        <ProfileMenu />
      </div>
    </header>
  );
}
