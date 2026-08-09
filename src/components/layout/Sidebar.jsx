import LogoMark from "@/components/common/LogoMark";
import SidebarItem from "@/components/layout/SidebarItem";
import ProfileSummaryCard from "@/components/layout/ProfileSummaryCard";
import { NAV_ITEMS, SETTINGS_NAV_ITEM } from "@/constants/nav";

/**
 * Desktop sidebar: brand, primary nav, settings, and the profile summary.
 * Hidden below the `lg` breakpoint in favor of MobileNav.
 */
export default function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-bg px-4 py-6 lg:flex">
      <div className="mb-8 flex items-center gap-2.5 px-2">
        <LogoMark size={28} />
        <span className="text-[14.5px] font-semibold tracking-tight text-text-primary">
          MoneyMate
        </span>
      </div>

      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => (
          <SidebarItem key={item.path} to={item.path} icon={item.icon} label={item.label} />
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-3">
        <SidebarItem
          to={SETTINGS_NAV_ITEM.path}
          icon={SETTINGS_NAV_ITEM.icon}
          label={SETTINGS_NAV_ITEM.label}
        />
        <div className="h-px bg-border" />
        <ProfileSummaryCard />
      </div>
    </aside>
  );
}
