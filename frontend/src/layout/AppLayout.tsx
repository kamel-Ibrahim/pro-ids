import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppLayout() {
  return (
    <div className="flex h-screen bg-[#050505] text-zinc-100 overflow-hidden w-full">
      {/* Sidebar - fixed width, no shrinking */}
      <Sidebar />

      {/* Main Content Area - fills remaining space, handles its own scroll */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar />
        
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 custom-scrollbar">
          {/* Container - prevents content from touching edges but stays within 100% width */}
          <div className="max-w-full mx-auto w-full animate-in fade-in duration-500">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}