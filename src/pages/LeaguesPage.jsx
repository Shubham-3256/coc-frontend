// src/pages/LeaguesPage.jsx
import { useEffect, useState } from "react";

const API =
  import.meta.env.VITE_API_URL || "https://coc-backend-eqfx.onrender.com";

function LeaguesPage() {
  const [leagues, setLeagues] = useState([]);

  useEffect(() => {
    fetch(`${API}/leagues`)
      .then((res) => res.json())
      .then((data) => setLeagues(data.items || []));
  }, []);

  return (
    <div>
      <h2 className="text-2xl mb-4">🥇 Leagues</h2>
      <ul className="list-disc pl-5">
        {leagues.map((l) => (
          <li key={l.id}>
            {l.name} (ID: {l.id})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LeaguesPage;
