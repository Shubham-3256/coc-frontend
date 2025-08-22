import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { CLAN_TAG, API_BASE } from "../config";

const COLORS = ["#4CAF50", "#F44336"];

export default function ClanWarsPage() {
  const [warlog, setWarlog] = useState([]);
  const [currentWar, setCurrentWar] = useState(null);

  useEffect(() => {
    async function fetchWars() {
      const [warlogRes, currentWarRes] = await Promise.all([
        fetch(`${API_BASE}/clan/${CLAN_TAG}/warlog`),
        fetch(`${API_BASE}/clan/${CLAN_TAG}/currentwar`),
      ]);
      setWarlog((await warlogRes.json()).items || []);
      setCurrentWar(await currentWarRes.json());
    }
    fetchWars();
  }, []);

  const warData = warlog.length
    ? [
        {
          name: "Wins",
          value: warlog.filter((w) => w.result === "win").length,
        },
        {
          name: "Losses",
          value: warlog.filter((w) => w.result === "lose").length,
        },
      ]
    : [];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 animate-fadeIn">Clan Wars</h1>

      {warData.length > 0 && (
        <div className="mb-6 h-64 animate-fadeIn">
          <h3 className="font-semibold mb-2">War Log Summary</h3>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={warData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {warData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {currentWar && (
        <div className="bg-white p-4 shadow rounded animate-pulseShadow mb-4 hover:shadow-lg transition-shadow duration-300">
          <h3 className="font-semibold mb-2">Current War</h3>
          <p>State: {currentWar.state}</p>
          <p>Team Size: {currentWar.teamSize}</p>
          <p>Preparation Start: {currentWar.preparationStartTime}</p>
        </div>
      )}
    </div>
  );
}
