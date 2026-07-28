import { Routes, Route } from "react-router-dom";
import Board from "./pages/Board";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Sidebar from "./components/Sidebar";
import "./App.css";

function App() {
  return (
    <div className="flex bg-surface-sidebar">
      <Sidebar />
      <Routes>
        <Route path="/board" element={<Board />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </div>
  );
}

export default App;
