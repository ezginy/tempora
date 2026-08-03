import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BarChart3,
  Settings,
  Menu,
  PanelLeft,
} from "lucide-react";
import TemporaIcon from "./TemporaIcon";

function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem("sidebarCollapsed") === "true";
  });

  const menuItems = [
    { label: "Board", icon: LayoutDashboard, path: "/board" },
    { label: "Analytics", icon: BarChart3, path: "/analytics" },
    { label: "Settings", icon: Settings, path: "/settings" },
  ];

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", String(isCollapsed));
  }, [isCollapsed]);

  return (
    <>
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="md:hidden fixed top-4 left-4 z-20 text-text-primary bg-surface-sidebar p-2 rounded-md"
      >
        <Menu size={20} />
      </button>

      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="md:hidden fixed inset-0 bg-black/50 z-30"
        />
      )}

      <div
        className={`w-56 min-h-screen bg-surface-sidebar border-r border-surface-column p-4 flex flex-col fixed md:static top-0 left-0 z-40 transition-all duration-300 ease-in-out   
          ${isCollapsed ? "md:w-20" : "md:w-56"}
          ${
            isSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          }`}
      >
        <div className="flex justify-between items-center mb-8">
          {isCollapsed ? (
            <div className="w-full flex justify-center">
              <button
                onClick={() => setIsCollapsed(false)}
                onMouseEnter={() => setIsLogoHovered(true)}
                onMouseLeave={() => setIsLogoHovered(false)}
                className="flex items-center justify-center w-8 h-8"
              >
                {isLogoHovered ? (
                  <PanelLeft
                    size={18}
                    className="text-text-muted hover:text-text-primary"
                  />
                ) : (
                  <TemporaIcon />
                )}
              </button>
            </div>
          ) : (
            <>
              <Link to="/" className="flex items-center gap-2">
                <TemporaIcon />
                <h1 className="text-xl font-bold text-text-primary">Tempora</h1>
              </Link>
              <button
                onClick={() => {
                  setIsCollapsed(true);
                  setIsSidebarOpen(false);
                }}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-surface-column text-text-muted hover:text-text-primary hover:bg-surface-card transition-colors"
              >
                <PanelLeft size={16} />
              </button>
            </>
          )}
        </div>

        <nav className="flex flex-col">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.label}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 py-3 px-2 mx-2 rounded-md ${
                    index !== 0 ? "border-t border-surface-card" : ""
                  } ${isActive ? "text-accent bg-accent-muted" : "text-text-muted"}`
                }
              >
                <Icon size={16} />
                {!isCollapsed && item.label}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </>
  );
}

export default Sidebar;
