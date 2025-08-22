import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";
import ClanPage from "./pages/ClanPage";
import PlayerPage from "./pages/PlayerPage";
import LeaderboardsPage from "./pages/LeaderboardsPage";
import LeaguesPage from "./pages/LeaguesPage";
import LabelsPage from "./pages/LabelsPage";
import GoldPassPage from "./pages/GoldPassPage";
import ClanWarsPage from "./pages/ClanWarsPage";

export default function App() {
  const navItems = [
    { name: "Clan", path: "/clan" },
    { name: "Players", path: "/player" },
    { name: "Leaderboards", path: "/leaderboards" },
    { name: "Leagues", path: "/leagues" },
    { name: "Labels", path: "/labels" },
    { name: "Gold Pass", path: "/goldpass" },
    { name: "Clan Wars", path: "/clanwars" },
  ];

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
          <h1 className="text-2xl font-bold">CoC Clan Dashboard</h1>
          <ul className="flex gap-4">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    isActive
                      ? "font-bold border-b-2 border-white pb-1"
                      : "hover:underline"
                  }
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <main className="flex-1 bg-gray-100 text-gray-900 p-6 transition-all duration-500 animate-fadeIn">
          <Routes>
            <Route path="/clan" element={<ClanPage />} />
            <Route path="/player" element={<PlayerPage />} />
            <Route path="/leaderboards" element={<LeaderboardsPage />} />
            <Route path="/leagues" element={<LeaguesPage />} />
            <Route path="/labels" element={<LabelsPage />} />
            <Route path="/goldpass" element={<GoldPassPage />} />
            <Route path="/clanwars" element={<ClanWarsPage />} />
            <Route path="*" element={<ClanPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
