import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ClanPage from "./pages/ClanPage";
import PlayerPage from "./pages/PlayerPage";
import LeaderboardsPage from "./pages/LeaderboardsPage";
import LeaguesPage from "./pages/LeaguesPage";
import LabelsPage from "./pages/LabelsPage";
import GoldPassPage from "./pages/GoldPassPage";
import ClanWarsPage from "./pages/ClanWarsPage";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-blue-600 text-white p-4 flex gap-6 flex-wrap">
          <Link to="/">Clan</Link>
          <Link to="/player">Player</Link>
          <Link to="/leaderboards">Leaderboards</Link>
          <Link to="/leagues">Leagues</Link>
          <Link to="/labels">Labels</Link>
          <Link to="/goldpass">Gold Pass</Link>
          <Link to="/clanwars">Clan Wars</Link>
        </nav>

        <div className="p-6">
          <Routes>
            <Route path="/" element={<ClanPage />} />
            <Route path="/player" element={<PlayerPage />} />
            <Route path="/leaderboards" element={<LeaderboardsPage />} />
            <Route path="/leagues" element={<LeaguesPage />} />
            <Route path="/labels" element={<LabelsPage />} />
            <Route path="/goldpass" element={<GoldPassPage />} />
            <Route path="/clanwars" element={<ClanWarsPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
