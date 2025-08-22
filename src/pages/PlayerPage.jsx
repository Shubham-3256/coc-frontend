import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CLAN_TAG, API_BASE } from "../config";

export default function PlayerPage() {
  const [members, setMembers] = useState([]);
  const [playersData, setPlayersData] = useState({});

  useEffect(() => {
    async function fetchMembers() {
      const res = await fetch(`${API_BASE}/clan/${CLAN_TAG}/members`);
      const membersList = (await res.json()).items || [];
      setMembers(membersList);

      const data = {};
      await Promise.all(
        membersList.map(async (m) => {
          const pRes = await fetch(
            `${API_BASE}/player/${m.tag.replace("#", "")}`
          );
          data[m.tag] = await pRes.json();
        })
      );
      setPlayersData(data);
    }
    fetchMembers();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 animate-fadeIn">Players Stats</h1>

      {members.map((m) => {
        const player = playersData[m.tag];
        if (!player) return null;

        const trophyHistory = Array.from({ length: 7 }).map((_, i) => ({
          day: `Day ${i + 1}`,
          trophies: player.trophies - Math.floor(Math.random() * 50),
        }));

        return (
          <div
            key={m.tag}
            className="mb-6 p-4 bg-white shadow rounded hover:shadow-lg transition-shadow duration-300 animate-fadeIn"
          >
            <h2 className="font-bold">
              {player.name} (TH {player.townHallLevel})
            </h2>
            <p>Trophies: {player.trophies}</p>
            <p>League: {player.league?.name || "N/A"}</p>

            {player.troops?.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-2">
                {player.troops.map((t) => (
                  <div key={t.name} className="p-2 border rounded bg-gray-100">
                    <p className="font-semibold">{t.name}</p>
                    <p>Level: {t.level}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 h-40">
              <ResponsiveContainer>
                <LineChart data={trophyHistory}>
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="trophies"
                    stroke="#FFD700"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      })}
    </div>
  );
}
