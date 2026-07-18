import { Outlet } from "react-router-dom";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";

/**
 * The persistent app shell: sidebar + navbar surrounding the routed page
 * content rendered via <Outlet />. Mounted once at the router root so
 * navigating between pages never remounts the chrome.
 */
export default function Layout() {
  return (
    <div className="flex min-h-screen w-full bg-bg">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <Navbar />
        <main className="flex max-w-[1400px] flex-col gap-4 px-6 py-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
