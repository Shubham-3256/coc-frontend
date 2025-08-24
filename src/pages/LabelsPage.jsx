import { useState, useEffect } from "react";
import { CLAN_TAG, API_BASE } from "../config";

export default function LabelsPage() {
  const [labels, setLabels] = useState([]);

  useEffect(() => {
    async function fetchLabels() {
      const res = await fetch(`${API_BASE}/clan/${CLAN_TAG}`);
      const data = await res.json();
      setLabels(data.labels || []);
    }
    fetchLabels();
  }, []);

  return (
    <div className="coc-container">
      <h1 className="coc-title">🏷️ Clan Labels</h1>
      <div className="flex flex-wrap gap-3">
        {labels.map((l) => (
          <span
            key={l.id}
            className="coc-badge bg-gray-800 text-gray-200 hover:bg-gray-700"
          >
            {l.name}
          </span>
        ))}
      </div>
    </div>
  );
}
