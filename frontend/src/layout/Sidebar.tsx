import { NavLink } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

interface NavItem {
  label: string;
  path: string;
}

export default function Sidebar() {
  const { user } = useAuth();

  // If auth is still loading or user is null, don't show the sidebar
  if (!user) return null;

  const studentNav: NavItem[] = [
    { label: "Dashboard", path: "/student" },
    { label: "My Courses", path: "/student/courses" },
  ];

  const instructorNav: NavItem[] = [
    { label: "Dashboard", path: "/instructor" },
    { label: "My Courses", path: "/instructor/courses" },
    { label: "Create Course", path: "/instructor/courses/new" },
  ];

  const navItems = user.role === "instructor" ? instructorNav : studentNav;

  return (
    <aside className="w-64 h-screen sticky top-0 bg-black/70 backdrop-blur-xl border-r border-zinc-800 flex flex-col overflow-y-auto">
      {/* Brand Logo */}
      <div className="p-6 text-2xl font-extrabold tracking-widest text-cyan-400">
        PRO•IDS
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            // end ensures that "/" doesn't stay active when on "/student"
            end={item.path.endsWith("/student") || item.path.endsWith("/instructor")}
            className={({ isActive }) =>
              `
              block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
              ${
                isActive
                  ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.1)]"
                  : "text-zinc-400 hover:bg-white/5 hover:text-white"
              }
            `
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User Footer */}
      <div className="p-4 text-xs border-t border-zinc-800 bg-zinc-900/30">
        <div className="text-zinc-500 uppercase tracking-tighter mb-1">Signed in as</div>
        <div className="text-cyan-400 font-bold capitalize">{user.role}</div>
        <div className="text-zinc-400 truncate mt-1">{user.email}</div>
      </div>
    </aside>
  );
}