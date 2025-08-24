import { useState, useEffect } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { CLAN_TAG, API_BASE } from "../config";

export default function ClanWarsPage() {
  const [currentWar, setCurrentWar] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(`${API_BASE}/clan/${CLAN_TAG}/currentwar`);
      setCurrentWar(await res.json());
    }
    fetchData();
  }, []);

  if (!currentWar || !currentWar.clan) {
    return <p className="text-gray-400">⚔️ No current war data available.</p>;
  }

  const data = [
    { stat: "Stars", value: currentWar.clan.stars },
    { stat: "Attacks", value: currentWar.clan.attacks || 0 },
    { stat: "Destruction %", value: currentWar.clan.destructionPercentage },
    { stat: "Exp Earned", value: currentWar.clan.expEarned },
  ];

  return (
    <div className="coc-container">
      <h1 className="coc-title">⚔️ Current War Stats</h1>

      <div className="coc-card h-96">
        <ResponsiveContainer>
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid stroke="#333" />
            <PolarAngleAxis dataKey="stat" stroke="#aaa" />
            <Tooltip />
            <Radar
              name="Clan Performance"
              dataKey="value"
              stroke="#22c55e"
              fill="#22c55e"
              fillOpacity={0.6}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
