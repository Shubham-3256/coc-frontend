import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CLAN_TAG, API_BASE } from "../config";

export default function LeaderboardsPage() {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    async function fetchMembers() {
      const res = await fetch(`${API_BASE}/clan/${CLAN_TAG}/members`);
      const data = (await res.json()).items || [];
      data.sort((a, b) => b.trophies - a.trophies);
      setMembers(data);
    }
    fetchMembers();
  }, []);

  return (
    <div className="coc-container">
      <h1 className="coc-title">🏆 Leaderboards</h1>
      <div className="coc-card h-[500px]">
        <ResponsiveContainer>
          <BarChart
            layout="vertical"
            data={members.map((m) => ({ name: m.name, trophies: m.trophies }))}
          >
            <XAxis type="number" stroke="#aaa" />
            <YAxis
              dataKey="name"
              type="category"
              width={100}
              stroke="#aaa"
              tick={{ fontSize: 12 }}
            />
            <Tooltip />
            <Bar
              dataKey="trophies"
              fill="#f59e0b"
              radius={[0, 5, 5, 0]}
              barSize={15}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
