import { useState, useEffect } from "react";

const API_URL = "https://coc-backend-eqfx.onrender.com";

export default function LeaderboardsPage() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/locations/global/rankings/players`)
      .then((res) => res.json())
      .then((data) => setPlayers(data.items || []));
  }, []);

  return (
    <div>
      <h1 className="text-2xl mb-4">Global Leaderboards</h1>
      <ul>
        {players.map((p) => (
          <li key={p.tag}>
            {p.name} - {p.trophies} trophies
          </li>
        ))}
      </ul>
    </div>
  );
}
