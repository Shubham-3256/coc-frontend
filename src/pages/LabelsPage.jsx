import { useState, useEffect } from "react";

const API_URL = "https://coc-backend-eqfx.onrender.com";

export default function LabelsPage() {
  const [clanLabels, setClanLabels] = useState([]);
  const [playerLabels, setPlayerLabels] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/labels/clans`)
      .then((res) => res.json())
      .then((data) => setClanLabels(data.items || []));

    fetch(`${API_URL}/labels/players`)
      .then((res) => res.json())
      .then((data) => setPlayerLabels(data.items || []));
  }, []);

  return (
    <div>
      <h1 className="text-2xl mb-4">Labels</h1>

      <h2 className="text-xl mt-4">Clan Labels</h2>
      <ul>
        {clanLabels.map((l) => (
          <li key={l.id}>{l.name}</li>
        ))}
      </ul>

      <h2 className="text-xl mt-4">Player Labels</h2>
      <ul>
        {playerLabels.map((l) => (
          <li key={l.id}>{l.name}</li>
        ))}
      </ul>
    </div>
  );
}
