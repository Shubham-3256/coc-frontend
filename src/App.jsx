import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ClanPage from "./pages/ClanPage";
import PlayerPage from "./pages/PlayerPage";
import LeaderboardsPage from "./pages/LeaderboardsPage";
import LeaguesPage from "./pages/LeaguesPage";
import LabelsPage from "./pages/LabelsPage";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white">
        {/* Navbar */}
        <nav className="bg-gray-800 p-4 flex gap-4">
          <Link to="/">Clan</Link>
          <Link to="/player">Player</Link>
          <Link to="/leaderboards">Leaderboards</Link>
          <Link to="/leagues">Leagues</Link>
          <Link to="/labels">Labels</Link>
        </nav>

        {/* Routes */}
        <div className="p-6">
          <Routes>
            <Route path="/" element={<ClanPage />} />
            <Route path="/player" element={<PlayerPage />} />
            <Route path="/leaderboards" element={<LeaderboardsPage />} />
            <Route path="/leagues" element={<LeaguesPage />} />
            <Route path="/labels" element={<LabelsPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
