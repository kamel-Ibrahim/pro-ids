import { useLocation } from "react-router-dom";

export default function Topbar() {
  const location = useLocation();

  // Helper to generate a nice page title from the URL
  const getPageTitle = () => {
    const path = location.pathname.split("/").filter(Boolean);
    if (path.length === 0) return "Welcome";
    const last = path[path.length - 1];
    return last.charAt(0).toUpperCase() + last.slice(1).replace("-", " ");
  };

  return (
    <header className="h-20 border-b border-zinc-800/50 bg-black/20 backdrop-blur-md flex items-center justify-between px-10 shrink-0">
      <div className="flex items-center gap-4">
        <div className="h-1 w-8 bg-cyan-500 rounded-full" />
        <h2 className="text-sm font-black text-zinc-400 uppercase tracking-[0.3em]">
          {getPageTitle()}
        </h2>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden md:flex flex-col items-end">
           {/* <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Network Status</span>
           <span className="text-[10px] font-bold text-green-500 uppercase flex items-center gap-1.5">
             <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
             Encrypted
           </span> */}
        </div>
      </div>
    </header>
  );
}