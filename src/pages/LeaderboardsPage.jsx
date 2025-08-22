// src/pages/LeaderboardsPage.jsx
import { useEffect, useState } from "react";

const API =
  import.meta.env.VITE_API_URL || "https://coc-backend-eqfx.onrender.com";

function LeaderboardsPage() {
  const [locations, setLocations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [clans, setClans] = useState([]);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    fetch(`${API}/locations`)
      .then((res) => res.json())
      .then((data) => setLocations(data.items || []));
  }, []);

  const fetchRankings = async () => {
    if (!selected) return;
    const res1 = await fetch(`${API}/locations/${selected}/rankings/clans`);
    const res2 = await fetch(`${API}/locations/${selected}/rankings/players`);
    setClans((await res1.json()).items || []);
    setPlayers((await res2.json()).items || []);
  };

  return (
    <div>
      <h2 className="text-2xl mb-4">🌍 Leaderboards</h2>

      <select
        onChange={(e) => setSelected(e.target.value)}
        className="border p-2 mr-2 text-black"
      >
        <option value="">Select Location</option>
        {locations.map((loc) => (
          <option key={loc.id} value={loc.id}>
            {loc.name}
          </option>
        ))}
      </select>
      <button
        onClick={fetchRankings}
        className="bg-blue-600 px-4 py-2 rounded text-white"
      >
        Load
      </button>

      {clans.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-bold">🏆 Top Clans</h3>
          <ol className="list-decimal pl-5">
            {clans.map((c) => (
              <li key={c.clan.tag}>
                {c.clan.name} - {c.clan.points} pts
              </li>
            ))}
          </ol>
        </div>
      )}

      {players.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-bold">👑 Top Players</h3>
          <ol className="list-decimal pl-5">
            {players.map((p) => (
              <li key={p.player.tag}>
                {p.player.name} - {p.player.trophies} 🏅
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

export default LeaderboardsPage;
