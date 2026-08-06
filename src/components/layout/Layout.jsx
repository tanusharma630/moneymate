import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import QuickAddModal from "@/components/layout/QuickAddModal";
import GlobalSearchModal from "@/components/modals/GlobalSearchModal";
import BudgetModal from "@/components/modals/BudgetModal";
import GoalModal from "@/components/modals/GoalModal";
import BorrowLendModal from "@/components/modals/BorrowLendModal";
import Toast from "@/components/ui/Toast";
import { useAppContext } from "@/context/AppContext";

/**
 * The persistent app shell: sidebar + navbar surrounding the routed page
 * content rendered via <Outlet />. Mounted once at the router root so
 * navigating between pages never remounts the chrome.
 *
 * Registers the ⌘K / Ctrl+K shortcut to open the GlobalSearchModal.
 */
export default function Layout() {
  const { openSearch } = useAppContext();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        openSearch();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openSearch]);

  return (
    <div className="flex min-h-screen w-full bg-bg">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <Navbar />
        <main className="flex max-w-[1400px] flex-col gap-4 px-6 py-6 lg:px-8">
          <Outlet />
        </main>
      </div>
      <QuickAddModal />
      <GlobalSearchModal />
      <BudgetModal />
      <GoalModal />
      <BorrowLendModal />
      <Toast />
    </div>
  );
}
