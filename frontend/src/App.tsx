import Board from "./components/Board";
import "./App.css";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <div className="flex bg-surface-sidebar">
      <Sidebar />
      <Board />
    </div>
  );
}

export default App;
