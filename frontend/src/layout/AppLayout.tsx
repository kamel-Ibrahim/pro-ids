import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppLayout() {
  return (
    <div className="min-h-screen flex bg-black text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="flex-1 p-6">
          {/* THE OUTLET IS REQUIRED TO LOAD YOUR DASHBOARD/COURSES PAGES */}
          <Outlet /> 
        </main>
      </div>
    </div>
  );
}