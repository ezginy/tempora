import { useState } from "react";
import { LayoutDashboard, BarChart3, Settings, Menu, X } from "lucide-react";

function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { label: "Board", icon: LayoutDashboard, active: true },
    { label: "Analytics", icon: BarChart3, active: false },
    { label: "Settings", icon: Settings, active: false },
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
          <h1 className="text-xl font-bold text-text-primary">Tempora</h1>
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
              <div
                key={item.label}
                className={`flex items-center gap-3 py-3 px-2 rounded-md ${
                  index !== 0 ? "border-t border-surface-card mx-2" : ""
                } ${
                  item.active
                    ? "text-accent bg-accent-muted"
                    : "text-text-muted"
                }`}
              >
                <Icon size={16} />
                {item.label}
              </div>
            );
          })}
        </nav>
      </div>
    </>
  );
}

export default Sidebar;
