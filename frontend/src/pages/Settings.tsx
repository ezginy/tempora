import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { Sun, Moon, LogOut } from "lucide-react";
import {
  type DefaultView,
  getDefaultView,
  DEFAULT_VIEW_LABELS,
} from "../utils/defaultView";

function Settings() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") !== "light";
  });
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [confirmBeforeDelete, setConfirmBeforeDelete] = useState(() => {
    return localStorage.getItem("confirmBeforeDelete") !== "false";
  });
  const [defaultView, setDefaultView] = useState<DefaultView>(getDefaultView);

  useEffect(() => {
    document.documentElement.classList.toggle("light", !isDarkMode);
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem("confirmBeforeDelete", String(confirmBeforeDelete));
  }, [confirmBeforeDelete]);

  useEffect(() => {
    localStorage.setItem("defaultView", defaultView);
  }, [defaultView]);

  const handleLogout = async () => {
    navigate("/");
    await logout();
  };

  return (
    <div className="p-4 md:p-8 mx-auto flex flex-col flex-1 h-screen overflow-y-auto md:max-w-3xl text-text-primary bg-surface-page">
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
            className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-surface-column text-text-muted hover:text-priority-high/85 hover:bg-priority-high/10 transition-colors duration-200"
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
            className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
              isDarkMode ? "bg-surface-column" : "bg-accent"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-surface-page flex items-center justify-center transition-transform duration-200 ${
                isDarkMode ? "translate-x-0" : "translate-x-5"
              }`}
            >
              {isDarkMode ? (
                <Moon size={12} className="text-text-primary/50" />
              ) : (
                <Sun size={12} className="text-text-primary/50" />
              )}
            </span>
          </button>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">Board Preferences</h2>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between p-4 rounded-lg bg-surface-card">
            <div>
              <p className="font-medium">Confirm before delete</p>
              <p className="text-sm text-text-muted">
                Ask before deleting a task
              </p>
            </div>
            <button
              onClick={() => setConfirmBeforeDelete(!confirmBeforeDelete)}
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                confirmBeforeDelete ? "bg-accent" : "bg-surface-column"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-surface-page transition-transform duration-200 ${
                  confirmBeforeDelete ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
          <div className="p-4 rounded-lg bg-surface-card flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium">Default view</p>
              <p className="text-sm text-text-muted">
                Where you land after logging in
              </p>
            </div>
            <div className="flex gap-2 justify-end">
              {(Object.keys(DEFAULT_VIEW_LABELS) as DefaultView[]).map(
                (view) => (
                  <button
                    key={view}
                    onClick={() => setDefaultView(view)}
                    className={`px-3 py-1.5 rounded-2xl text-sm transition-colors ${
                      defaultView === view
                        ? "bg-accent text-surface-page font-semibold"
                        : "bg-surface-column text-text-muted hover:text-text-primary"
                    }`}
                  >
                    {DEFAULT_VIEW_LABELS[view]}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Settings;
