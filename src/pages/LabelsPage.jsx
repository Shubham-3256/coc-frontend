import { useState, useEffect } from "react";
import { API_BASE } from "../config";

export default function LabelsPage() {
  const [clanLabels, setClanLabels] = useState([]);
  const [playerLabels, setPlayerLabels] = useState([]);

  useEffect(() => {
    async function fetchLabels() {
      const [clansRes, playersRes] = await Promise.all([
        fetch(`${API_BASE}/labels/clans`),
        fetch(`${API_BASE}/labels/players`),
      ]);
      setClanLabels((await clansRes.json()).items || []);
      setPlayerLabels((await playersRes.json()).items || []);
    }
    fetchLabels();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 animate-fadeIn">Labels</h1>

      <h2 className="text-xl font-semibold mb-2">Clan Labels</h2>
      <div className="flex flex-wrap gap-2 mb-4">
        {clanLabels.map((label) => (
          <div
            key={label.id}
            className="px-3 py-1 bg-yellow-200 rounded animate-fadeIn"
          >
            {label.name}
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold mb-2">Player Labels</h2>
      <div className="flex flex-wrap gap-2">
        {playerLabels.map((label) => (
          <div
            key={label.id}
            className="px-3 py-1 bg-green-200 rounded animate-fadeIn"
          >
            {label.name}
          </div>
        ))}
      </div>
    </div>
  );
}
