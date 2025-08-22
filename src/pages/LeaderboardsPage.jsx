import { useState, useEffect } from "react";
import { CLAN_TAG, API_BASE } from "../config";

export default function LeaderboardsPage() {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    async function fetchMembers() {
      const res = await fetch(`${API_BASE}/clan/${CLAN_TAG}/members`);
      const data = (await res.json()).items || [];
      setMembers(data.sort((a, b) => b.trophies - a.trophies));
    }
    fetchMembers();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 animate-fadeIn">
        Clan Leaderboard
      </h1>
      <table className="w-full border-collapse border border-gray-300 animate-fadeIn">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">Rank</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Trophies</th>
          </tr>
        </thead>
        <tbody>
          {members.map((m, idx) => (
            <tr key={m.tag} className="hover:bg-gray-50">
              <td className="border px-4 py-2">{idx + 1}</td>
              <td className="border px-4 py-2">{m.name}</td>
              <td className="border px-4 py-2">{m.trophies}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
