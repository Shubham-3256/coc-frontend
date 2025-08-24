import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import ClanPage from "./pages/ClanPage";
import ClanWarsPage from "./pages/ClanWarsPage";
import GoldPassPage from "./pages/GoldPassPage";
import LabelsPage from "./pages/LabelsPage";
import LeaderboardsPage from "./pages/LeaderboardsPage";
import LeaguesPage from "./pages/LeaguesPage";
import PlayerPage from "./pages/PlayerPage";

import {
  FaUsers,
  FaBattleNet,
  FaMedal,
  FaTags,
  FaCrown,
  FaTrophy,
  FaUser,
  FaBars,
  FaTimes,
} from "react-icons/fa";

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-[#0f172a] text-gray-200">
        {/* Navbar */}
        <header className="bg-[#1e293b] border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link
                to="/"
                className="text-xl font-bold text-white flex items-center gap-2"
              >
                ⚔️ CoC Dashboard
              </Link>

              {/* Desktop Menu */}
              <nav className="hidden md:flex space-x-6">
                <NavLink to="/" icon={<FaUsers />} label="Clan" />
                <NavLink to="/wars" icon={<FaBattleNet />} label="Wars" />
                <NavLink to="/goldpass" icon={<FaMedal />} label="Gold Pass" />
                <NavLink to="/labels" icon={<FaTags />} label="Labels" />
                <NavLink
                  to="/leaderboards"
                  icon={<FaCrown />}
                  label="Leaderboards"
                />
                <NavLink to="/leagues" icon={<FaTrophy />} label="Leagues" />
                <NavLink to="/player" icon={<FaUser />} label="Player" />
              </nav>

              {/* Mobile Hamburger */}
              <button
                className="md:hidden text-gray-300 hover:text-white"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
              </button>
            </div>
          </div>

          {/* Mobile Dropdown */}
          {menuOpen && (
            <div className="md:hidden bg-[#1e293b] border-t border-gray-700 px-4 py-3 space-y-3">
              <NavLink to="/" icon={<FaUsers />} label="Clan" />
              <NavLink to="/wars" icon={<FaBattleNet />} label="Wars" />
              <NavLink to="/goldpass" icon={<FaMedal />} label="Gold Pass" />
              <NavLink to="/labels" icon={<FaTags />} label="Labels" />
              <NavLink
                to="/leaderboards"
                icon={<FaCrown />}
                label="Leaderboards"
              />
              <NavLink to="/leagues" icon={<FaTrophy />} label="Leagues" />
              <NavLink to="/player" icon={<FaUser />} label="Player" />
            </div>
          )}
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 max-w-7xl mx-auto w-full">
          <Routes>
            <Route path="/" element={<ClanPage />} />
            <Route path="/wars" element={<ClanWarsPage />} />
            <Route path="/goldpass" element={<GoldPassPage />} />
            <Route path="/labels" element={<LabelsPage />} />
            <Route path="/leaderboards" element={<LeaderboardsPage />} />
            <Route path="/leagues" element={<LeaguesPage />} />
            <Route
              path="/player"
              element={<PlayerPage playerTag="#PLAYER_TAG" />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function NavLink({ to, icon, label }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-2 text-gray-300 hover:text-white transition font-medium"
    >
      <span className="text-sm">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}
