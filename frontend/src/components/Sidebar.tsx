import { useState } from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, BarChart3, Settings, Menu, X } from "lucide-react";
import TemporaIcon from "./TemporaIcon";

function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { label: "Board", icon: LayoutDashboard, path: "/board" },
    { label: "Analytics", icon: BarChart3, path: "/analytics" },
    { label: "Settings", icon: Settings, path: "/settings" },
  ];

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
        className={`w-56 min-h-screen bg-surface-sidebar border-r border-surface-column p-6 flex flex-col fixed md:static top-0 left-0 z-40 transition-transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2 mb-8">
            <TemporaIcon />
            <h1 className="text-xl font-bold text-text-primary">Tempora</h1>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden text-text-muted"
          >
            <X size={16} />
          </button>
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
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </>
  );
}

export default Sidebar;
