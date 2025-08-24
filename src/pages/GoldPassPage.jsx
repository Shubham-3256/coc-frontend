import { useState, useEffect } from "react";
import { CLAN_TAG, API_BASE } from "../config";

export default function GoldPassPage() {
  const [pass, setPass] = useState(null);

  useEffect(() => {
    async function fetchPass() {
      const res = await fetch(`${API_BASE}/clan/${CLAN_TAG}/goldpass`);
      setPass(await res.json());
    }
    fetchPass();
  }, []);

  if (!pass) return <p className="text-gray-400">⏳ Loading Gold Pass…</p>;

  const progress = pass.progress || 0;

  return (
    <div className="coc-container">
      <h1 className="coc-title">🥇 Gold Pass Progress</h1>

      <div className="coc-card flex flex-col items-center justify-center h-80">
        <svg className="w-40 h-40 transform -rotate-90">
          <circle
            cx="80"
            cy="80"
            r="70"
            stroke="#333"
            strokeWidth="10"
            fill="none"
          />
          <circle
            cx="80"
            cy="80"
            r="70"
            stroke="#facc15"
            strokeWidth="10"
            strokeDasharray={440}
            strokeDashoffset={440 - (progress / 100) * 440}
            strokeLinecap="round"
            fill="none"
          />
        </svg>
        <p className="text-2xl font-bold mt-4">{progress}%</p>
        <p className="text-gray-400">Season Progress</p>
      </div>
    </div>
  );
}
