// src/pages/LabelsPage.jsx
import { useEffect, useState } from "react";

const API =
  import.meta.env.VITE_API_URL || "https://coc-backend-eqfx.onrender.com";

function LabelsPage() {
  const [clanLabels, setClanLabels] = useState([]);
  const [playerLabels, setPlayerLabels] = useState([]);

  useEffect(() => {
    fetch(`${API}/labels/clans`)
      .then((res) => res.json())
      .then((data) => setClanLabels(data.items || []));
    fetch(`${API}/labels/players`)
      .then((res) => res.json())
      .then((data) => setPlayerLabels(data.items || []));
  }, []);

  return (
    <div>
      <h2 className="text-2xl mb-4">🏷️ Labels</h2>

      <h3 className="text-xl font-bold mt-4">Clan Labels</h3>
      <ul className="list-disc pl-5">
        {clanLabels.map((l) => (
          <li key={l.id}>{l.name}</li>
        ))}
      </ul>

      <h3 className="text-xl font-bold mt-4">Player Labels</h3>
      <ul className="list-disc pl-5">
        {playerLabels.map((l) => (
          <li key={l.id}>{l.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default LabelsPage;
