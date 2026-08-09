import { Link } from "react-router-dom";
import TemporaIcon from "../components/TemporaIcon";
import { useAuth } from "../context/useAuth";

function Home() {
  const { user, isLoading } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center flex-1 h-screen gap-4 text-center px-4">
      <TemporaIcon />
      <h1 className="text-3xl font-bold text-text-primary">Tempora</h1>
      <p className="text-text-muted max-w-sm">
        A Kanban board that shows you where your tasks actually spend their
        time.
      </p>

      {!isLoading && (
        <>
          {user ? (
            <Link
              to="/board"
              className="mt-4 px-4 py-2 rounded-lg bg-accent text-surface-page font-semibold hover:opacity-80 transition-opacity"
            >
              Go to Board
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
        </>
      )}
    </div>
  );
}

export default Home;
