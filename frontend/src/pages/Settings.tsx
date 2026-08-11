import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { Sun, Moon, LogOut } from "lucide-react";

function Settings() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") !== "light";
  });
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.classList.toggle("light", !isDarkMode);
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const handleLogout = async () => {
    navigate("/");
    await logout();
  };

  return (
    <div className="p-4 md:p-8 mx-auto flex flex-col flex-1 h-screen md:max-w-3xl text-text-primary bg-surface-page">
      <h1 className="text-2xl font-bold mb-8 text-center">Settings</h1>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Account</h2>
        <div className="flex items-center justify-between p-4 rounded-lg bg-surface-card">
          <div>
            <p className="font-medium">Log out</p>
            <p className="text-sm text-text-muted">Sign out of your account</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-surface-column text-priority-high/85"
          >
            <LogOut size={16} /> Log out
          </button>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Appearance</h2>
        <div className="flex items-center justify-between p-4 rounded-lg bg-surface-card">
          <div>
            <p className="font-medium">Theme</p>
            <p className="text-sm text-text-muted">Choose light or dark mode</p>
          </div>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-surface-column text-text-primary"
          >
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
            {isDarkMode ? "Light" : "Dark"}
          </button>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">Board Preferences</h2>
        <div className="flex flex-col gap-3">
          <div className="p-4 rounded-lg bg-surface-card">
            <p className="font-medium">Confirm before delete</p>
            <p className="text-sm text-text-muted">Coming soon.</p>
          </div>
          <div className="p-4 rounded-lg bg-surface-card">
            <p className="font-medium">Default view</p>
            <p className="text-sm text-text-muted">Coming soon.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Settings;
