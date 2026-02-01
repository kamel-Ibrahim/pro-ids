import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Define navigation based on role, or "Guest" mode
  const navItems = !user 
    ? [
        { label: "Course Catalog", path: "/", icon: <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /> },
        { label: "Sign In", path: "/login", icon: <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3" /> },
      ]
    : user.role === "instructor" 
    ? [
        { label: "Instructor Hub", path: "/instructor", icon: <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /> },
        { label: "My Courses", path: "/instructor/courses", icon: <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /> },
        { label: "Create Course", path: "/instructor/courses/new", icon: <path d="M12 5v14M5 12h14" /> },
      ]
    : [
        { label: "My Dashboard", path: "/student", icon: <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /> },
        { label: "My Learning", path: "/student/courses", icon: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></> },
        { label: "Course Catalog", path: "/", icon: <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /> },
      ];

  return (
    <aside className="w-72 bg-black border-r border-zinc-800/50 flex flex-col z-20 h-screen sticky top-0">
      <div className="p-8">
        <div className="text-2xl font-black tracking-tighter text-white flex items-center gap-2">
          <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-black rounded-sm" />
          </div>
          PRO•IDS
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/student" || item.path === "/instructor" || item.path === "/"}
            className={({ isActive }) => `
              flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300
              ${isActive 
                ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_20px_rgba(34,211,238,0.05)]" 
                : "text-zinc-500 hover:bg-white/5 hover:text-zinc-200"}
            `}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              {item.icon}
            </svg>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {user && (
        <div className="p-6 border-t border-zinc-800/50 bg-zinc-900/20">
  <NavLink 
    to="/settings/password" 
    className={({ isActive }) => `flex items-center gap-3 mb-6 p-2 rounded-xl transition-all ${isActive ? 'bg-cyan-500/10 ring-1 ring-cyan-500/30' : 'hover:bg-white/5'}`}
  >
    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-600 to-purple-600 border-2 border-zinc-800 shadow-xl shrink-0" />
    <div className="overflow-hidden">
      <p className="text-sm font-bold text-white truncate">{user.name}</p>
      <p className="text-[9px] font-black text-cyan-500 uppercase tracking-widest flex items-center gap-1">
        {user.role} <span className="text-zinc-600">• Edit</span>
      </p>
    </div>
  </NavLink>
  
  <button 
    onClick={handleLogout}
    className="w-full py-3 bg-zinc-900 hover:bg-red-500/10 text-zinc-400 hover:text-red-400 rounded-xl text-xs font-black transition-all border border-zinc-800 hover:border-red-500/20"
  >
    SIGN OUT
  </button>
</div>
      )}
    </aside>
  );
}