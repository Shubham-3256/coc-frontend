import { useState } from "react";

const API_URL = "https://coc-backend-eqfx.onrender.com";

export default function ClanPage() {
  const [tag, setTag] = useState("");
  const [clan, setClan] = useState(null);

  const fetchClan = async () => {
    const res = await fetch(`${API_URL}/clan/${tag}`);
    const data = await res.json();
    setClan(data);
  };

  return (
    <div>
      <h1 className="text-2xl mb-4">Clan Info</h1>
      <input
        className="p-2 text-black"
        placeholder="Enter clan tag (without #)"
        value={tag}
        onChange={(e) => setTag(e.target.value)}
      />
      <button onClick={fetchClan} className="ml-2 p-2 bg-blue-500">
        Fetch
      </button>

      {clan && (
        <div className="mt-4">
          <h2 className="text-xl">{clan.name}</h2>
          <p>Level: {clan.clanLevel}</p>
          <p>Members: {clan.members}</p>
        </div>
      )}
    </div>
  );
}
