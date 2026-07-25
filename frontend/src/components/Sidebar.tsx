import { LayoutDashboard, BarChart3, Settings } from "lucide-react";

function Sidebar() {
  const menuItems = [
    { label: "Board", icon: LayoutDashboard, active: true },
    { label: "Analytics", icon: BarChart3, active: false },
    { label: "Settings", icon: Settings, active: false },
  ];

  return (
    <div className="w-56 min-h-screen bg-surface-sidebar border-r border-surface-column p-6 flex flex-col">
      <h1 className="text-xl font-bold text-text-primary mb-8">Tempora</h1>

      <nav className="flex flex-col">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className={`flex items-center gap-3 py-3 px-2 rounded-md ${
                index !== 0 ? "border-t border-surface-card mx-2" : ""
              } ${
                item.active ? "text-accent bg-accent-muted" : "text-text-muted"
              }`}
            >
              <Icon size={16} />
              {item.label}
            </div>
          );
        })}
      </nav>
    </div>
  );
}

export default Sidebar;
