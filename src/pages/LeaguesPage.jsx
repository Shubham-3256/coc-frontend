import { useState, useEffect } from "react";

const API_URL = "https://coc-backend-eqfx.onrender.com";

export default function LeaguesPage() {
  const [leagues, setLeagues] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/leagues`)
      .then((res) => res.json())
      .then((data) => setLeagues(data.items || []));
  }, []);

  return (
    <div>
      <h1 className="text-2xl mb-4">Leagues</h1>
      <ul>
        {leagues.map((l) => (
          <li key={l.id}>{l.name}</li>
        ))}
      </ul>
    </div>
  );
}
