import { useState } from "react";

function ClanDashboard() {
  const [tag, setTag] = useState("");
  const [clan, setClan] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchClan = async () => {
    if (!tag) return;
    setLoading(true);
    try {
      const res = await fetch(
        `https://coc-backend-eqfx.onrender.com/clan/${tag}`
      );
      const data = await res.json();
      setClan(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Clash of Clans Dashboard</h1>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter Clan Tag (without #)"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          className="border p-2 rounded flex-grow"
        />
        <button
          onClick={fetchClan}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      {loading && <p>Loading...</p>}

      {clan && clan.name ? (
        <div className="mt-4 border p-4 rounded shadow bg-white">
          <h2 className="text-xl font-bold">{clan.name}</h2>
          <p>Level: {clan.clanLevel}</p>
          <p>Members: {clan.members}</p>
          <p>Points: {clan.clanPoints}</p>
        </div>
      ) : (
        clan && <p className="text-red-500">Clan not found!</p>
      )}
    </div>
  );
}

export default ClanDashboard;
