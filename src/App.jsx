// src/App.jsx
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ClanPage from "./pages/ClanPage";
import PlayerPage from "./pages/PlayerPage";
import LeaderboardsPage from "./pages/LeaderboardsPage";
import LeaguesPage from "./pages/LeaguesPage";
import LabelsPage from "./pages/LabelsPage";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
        {/* Navbar */}
        <nav className="bg-blue-600 p-4 flex gap-6 text-white font-bold">
          <Link to="/">Home</Link>
          <Link to="/clan">Clan</Link>
          <Link to="/player">Player</Link>
          <Link to="/leaderboards">Leaderboards</Link>
          <Link to="/leagues">Leagues</Link>
          <Link to="/labels">Labels</Link>
        </nav>

        {/* Pages */}
        <div className="p-6">
          <Routes>
            <Route
              path="/"
              element={
                <h1 className="text-3xl">🏆 Clash of Clans Dashboard</h1>
              }
            />
            <Route path="/clan" element={<ClanPage />} />
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
