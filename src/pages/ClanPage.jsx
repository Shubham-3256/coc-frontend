// src/pages/ClanPage.jsx
import { useState } from "react";

const API =
  import.meta.env.VITE_API_URL || "https://coc-backend-eqfx.onrender.com";

function ClanPage() {
  const [tag, setTag] = useState("");
  const [clan, setClan] = useState(null);
  const [members, setMembers] = useState(null);
  const [warlog, setWarlog] = useState(null);

  const fetchClan = async () => {
    const res = await fetch(`${API}/clan/${tag}`);
    setClan(await res.json());
  };

  const fetchMembers = async () => {
    const res = await fetch(`${API}/clan/${tag}/members`);
    setMembers(await res.json());
  };

  const fetchWarlog = async () => {
    const res = await fetch(`${API}/clan/${tag}/warlog`);
    setWarlog(await res.json());
  };

  return (
    <div>
      <h2 className="text-2xl mb-4">🔎 Search Clan</h2>
      <input
        type="text"
        placeholder="Enter Clan Tag (without #)"
        value={tag}
        onChange={(e) => setTag(e.target.value)}
        className="border p-2 mr-2 text-black"
      />
      <button
        onClick={fetchClan}
        className="bg-blue-600 px-4 py-2 rounded text-white mr-2"
      >
        Get Info
      </button>
      <button
        onClick={fetchMembers}
        className="bg-green-600 px-4 py-2 rounded text-white mr-2"
      >
        Get Members
      </button>
      <button
        onClick={fetchWarlog}
        className="bg-purple-600 px-4 py-2 rounded text-white"
      >
        Get Warlog
      </button>

      {/* Results */}
      {clan && (
        <div className="mt-6 p-4 border rounded bg-white dark:bg-gray-800">
          <h3 className="text-xl font-bold">
            {clan.name} ({clan.tag})
          </h3>
          <p>
            Level: {clan.clanLevel} | Members: {clan.members}
          </p>
        </div>
      )}

      {members && (
        <div className="mt-6">
          <h3 className="text-xl font-bold">👥 Members</h3>
          <ul className="list-disc pl-5">
            {members.items?.map((m) => (
              <li key={m.tag}>
                {m.name} ({m.role}) - TH {m.townHallLevel}
              </li>
            ))}
          </ul>
        </div>
      )}

      {warlog && (
        <div className="mt-6">
          <h3 className="text-xl font-bold">⚔️ War Log</h3>
          <ul className="list-disc pl-5">
            {warlog.items?.map((w, i) => (
              <li key={i}>
                {w.clan.name} vs {w.opponent.name} - {w.result}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ClanPage;
