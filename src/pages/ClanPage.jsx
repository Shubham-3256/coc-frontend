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

const ROLE_COLOR = {
  leader: "#FFD700",
  coLeader: "#C0C0C0",
  elder: "#00BFFF",
  member: "#90EE90",
};

export default function ClanPage() {
  const [clan, setClan] = useState(null);
  const [members, setMembers] = useState([]);
  const [warlog, setWarlog] = useState([]);
  const [currentWar, setCurrentWar] = useState(null);

  useEffect(() => {
    async function fetchClanData() {
      const [clanRes, membersRes, warlogRes, currentWarRes] = await Promise.all(
        [
          fetch(`${API_BASE}/clan/${CLAN_TAG}`),
          fetch(`${API_BASE}/clan/${CLAN_TAG}/members`),
          fetch(`${API_BASE}/clan/${CLAN_TAG}/warlog`),
          fetch(`${API_BASE}/clan/${CLAN_TAG}/currentwar`),
        ]
      );
      setClan(await clanRes.json());
      setMembers((await membersRes.json()).items || []);
      setWarlog((await warlogRes.json()).items || []);
      setCurrentWar(await currentWarRes.json());
    }
    fetchClanData();
  }, []);

  const chartData = warlog.map((w, idx) => ({
    war: `War ${idx + 1}`,
    clanStars: w.clan.stars,
    oppStars: w.opponent.stars,
  }));

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 animate-fadeIn">Clan Overview</h1>

      {clan && (
        <div className="bg-gradient-to-r from-blue-400 to-blue-700 text-white p-6 rounded shadow-md mb-6 transform transition-transform hover:scale-105">
          <h2 className="text-2xl font-bold">{clan.name}</h2>
          <div className="flex gap-6 mt-2">
            <div>Level: {clan.clanLevel}</div>
            <div>Members: {clan.members}</div>
            <div>Trophies: {clan.clanPoints}</div>
            <div>War Frequency: {clan.warFrequency}</div>
          </div>
        </div>
      )}

      {members.length > 0 && (
        <div className="mb-6 animate-fadeIn">
          <h3 className="text-xl font-semibold mb-2">Members</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {members.map((m) => (
              <div
                key={m.tag}
                className="p-4 bg-white rounded shadow hover:shadow-lg transition-shadow duration-300"
              >
                <h4 className="font-semibold">{m.name}</h4>
                <p style={{ color: ROLE_COLOR[m.role] || "black" }}>{m.role}</p>
                <p>Trophies: {m.trophies}</p>
                <div className="bg-gray-200 h-3 w-full rounded mt-1">
                  <div
                    className="bg-yellow-400 h-3 rounded"
                    style={{ width: `${(m.trophies / 5000) * 100}%` }}
                  ></div>
                </div>
                <p>Donations: {m.donations}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {chartData.length > 0 && (
        <div className="mb-6 h-64 animate-fadeIn">
          <h3 className="font-semibold mb-2">War Log Stars</h3>
          <ResponsiveContainer>
            <BarChart data={chartData}>
              <XAxis dataKey="war" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="clanStars" fill="#4CAF50" name="Clan Stars" />
              <Bar dataKey="oppStars" fill="#F44336" name="Opponent Stars" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {currentWar && (
        <div className="bg-white p-4 shadow rounded animate-pulseShadow mb-4">
          <h3 className="font-semibold mb-2">Current War</h3>
          <p>State: {currentWar.state}</p>
          <p>Team Size: {currentWar.teamSize}</p>
          <p>Preparation Start: {currentWar.preparationStartTime}</p>
        </div>
      )}
    </div>
  );
}
