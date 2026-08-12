import { Link } from "react-router-dom";
import TemporaIcon from "../components/TemporaIcon";
import { useAuth } from "../context/useAuth";
import { LayoutDashboard, Timer, BarChart3 } from "lucide-react";
import { DEFAULT_VIEW_LABELS, getDefaultView } from "../utils/defaultView";

function Home() {
  const { user, isLoading } = useAuth();

  const features = [
    {
      icon: LayoutDashboard,
      title: "Drag & drop",
      description: "Move tasks between columns with a simple drag",
    },
    {
      icon: Timer,
      title: "Time tracking",
      description: "See exactly how long each task sits in progress",
    },
    {
      icon: BarChart3,
      title: "Analytics",
      description: "Compare estimated vs. actual time at a glance",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center flex-1 h-screen gap-4 text-center px-4">
      <TemporaIcon size={48} />
      <h1 className="text-3xl font-bold text-text-primary">Tempora</h1>
      <p className="text-text-muted max-w-sm p-2">
        A Kanban board that shows you where your tasks actually spend their
        time.
      </p>

      {isLoading ? (
        <div className="mt-4 px-4 py-2 rounded-lg bg-surface-column text-text-muted font-semibold opacity-50 animate-pulse">
          Loading...
        </div>
      ) : user ? (
        <Link
          to={`/${getDefaultView()}`}
          className="mt-4 px-4 py-2 rounded-lg bg-accent text-surface-page font-semibold hover:opacity-80 transition-opacity"
        >
          Go to {DEFAULT_VIEW_LABELS[getDefaultView()]}
        </Link>
      ) : (
        <div className="flex gap-3 mt-4">
          <Link
            to="/login"
            className="px-4 py-2 rounded-lg border border-text-muted text-text-primary hover:border-text-primary transition-colors"
          >
            Log in
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 rounded-lg bg-accent text-surface-page font-semibold hover:opacity-80 transition-opacity"
          >
            Register
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-3xl w-full">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.title}
              className="flex flex-col items-center text-center gap-2 p-4"
            >
              <Icon size={24} className="text-accent" />
              <h3 className="text-sm font-semibold text-text-primary">
                {feature.title}
              </h3>
              <p className="text-xs text-text-muted">{feature.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Home;
