import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import { API_BASE } from "../config";

const COLORS = ["#22c55e", "#ef4444", "#3b82f6", "#f59e0b"];

export default function PlayerPage({ playerTag }) {
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    async function fetchPlayer() {
      const res = await fetch(
        `${API_BASE}/player/${encodeURIComponent(playerTag)}`
      );
      setPlayer(await res.json());
    }
    fetchPlayer();
  }, [playerTag]);

  if (!player) return <p className="text-gray-400">⏳ Loading Player...</p>;

  const donationsData = [
    { name: "Donations", value: player.donations },
    { name: "Received", value: player.donationsReceived },
  ];

  const trophyHistory = Array.from({ length: 7 }).map((_, i) => ({
    day: i + 1,
    trophies: player.trophies - Math.floor(Math.random() * 50),
  }));

  return (
    <div className="coc-container">
      <h1 className="coc-title">👤 {player.name}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="coc-card h-72">
          <h3 className="coc-subtitle">🏆 Trophy History</h3>
          <ResponsiveContainer>
            <LineChart data={trophyHistory}>
              <Line
                type="monotone"
                dataKey="trophies"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="coc-card h-72">
          <h3 className="coc-subtitle">📤 Donations</h3>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={donationsData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {donationsData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
