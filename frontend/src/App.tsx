import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Board from "./pages/Board";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Sidebar from "./components/Sidebar";
import Notifications from "./pages/Notifications";
import Help from "./pages/Help";
import "./App.css";

function App() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <div className="flex bg-surface-page">
      {!isHomePage && <Sidebar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/board" element={<Board />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/help" element={<Help />} />
      </Routes>
    </div>
  );
}

export default App;
