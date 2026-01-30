import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "./layout.css";

function getTitle(pathname: string) {
  if (pathname === "/") return "My Learning";
  if (pathname === "/catalog") return "Course Catalog";
  if (pathname === "/progress") return "My Progress";
  if (pathname === "/certificates") return "Certificates";

  // dynamic routes
  if (pathname.startsWith("/course/")) return "Course";
  if (pathname.startsWith("/student/certificates/")) return "Certificate";

  return "";
}

export default function StudentLayout() {
  const location = useLocation();
  const title = getTitle(location.pathname);

  return (
    <div className="app-root">
      <Sidebar />
      <div className="main">
        <Topbar title={title} />
        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}