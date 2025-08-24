import { useState, useEffect } from "react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { CLAN_TAG, API_BASE } from "../config";

const TIER_COLOR = {
  Bronze: "#b77c4f",
  Silver: "#a9a9a9",
  Gold: "#d4af37",
  Crystal: "#64c2f1",
  Master: "#7b68ee",
  Champion: "#ff6347",
  Titan: "#4b0082",
  Legend: "#ff1493",
};

export default function LeaguesPage() {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    async function fetchMembers() {
      const res = await fetch(`${API_BASE}/clan/${CLAN_TAG}/members`);
      const data = (await res.json()).items || [];

      data.forEach((m) => {
        m.trophyHistory = Array.from({ length: 7 }).map((_, i) => ({
          day: i + 1,
          trophies: m.trophies - Math.floor(Math.random() * 40),
        }));
      });

      data.sort((a, b) => b.trophies - a.trophies);
      setMembers(data);
    }
    fetchMembers();
  }, []);

  return (
    <div className="coc-container">
      <h1 className="coc-title">🏅 Clan Member Leagues</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((m) => {
          const tierColor = TIER_COLOR[m.league?.name] || "#888";
          return (
            <div
              key={m.tag}
              className="coc-card relative animate-fadeIn"
              style={{ borderLeft: `5px solid ${tierColor}` }}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">{m.name}</h3>
                {m.league?.iconUrls?.medium && (
                  <img
                    src={m.league.iconUrls.medium}
                    alt={m.league.name}
                    className="w-10 h-10 rounded-full"
                  />
                )}
              </div>
              <p className="text-gray-400 text-sm">Rank: {m.rank}</p>
              <p className="text-gray-400 text-sm">Role: {m.role}</p>

              {/* Trophy Sparkline */}
              <div className="h-16 mt-3">
                <ResponsiveContainer>
                  <LineChart data={m.trophyHistory}>
                    <Line
                      type="monotone"
                      dataKey="trophies"
                      stroke={tierColor}
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <p className="mt-2 text-gray-400 text-sm">
                League: {m.league?.name || "N/A"}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
