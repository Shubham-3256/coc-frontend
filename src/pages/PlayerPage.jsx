import { useState } from "react";

const API_URL = "https://coc-backend-eqfx.onrender.com";

export default function PlayerPage() {
  const [tag, setTag] = useState("");
  const [player, setPlayer] = useState(null);

  const fetchPlayer = async () => {
    const res = await fetch(`${API_URL}/player/${tag}`);
    const data = await res.json();
    setPlayer(data);
  };

  return (
    <div>
      <h1 className="text-2xl mb-4">Player Info</h1>
      <input
        className="p-2 text-black"
        placeholder="Enter player tag (without #)"
        value={tag}
        onChange={(e) => setTag(e.target.value)}
      />
      <button onClick={fetchPlayer} className="ml-2 p-2 bg-blue-500">
        Fetch
      </button>

      {player && (
        <div className="mt-4">
          <h2 className="text-xl">{player.name}</h2>
          <p>Townhall: {player.townHallLevel}</p>
          <p>Trophies: {player.trophies}</p>
        </div>
      )}
    </div>
  );
}
