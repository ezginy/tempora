import { Link } from "react-router-dom";
import TemporaIcon from "../components/TemporaIcon";

function Home() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 h-screen gap-4 text-center px-4">
      <TemporaIcon />
      <h1 className="text-3xl font-bold text-text-primary">Tempora</h1>
      <p className="text-text-muted max-w-sm">
        A Kanban board that shows you where your tasks actually spend their
        time.
      </p>
      <Link
        to="/board"
        className="mt-4 px-4 py-2 rounded-lg bg-accent text-surface-page font-semibold hover:opacity-80 transition-opacity"
      >
        Go to Board
      </Link>
    </div>
  );
}

export default Home;
