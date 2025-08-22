// src/pages/PlayerPage.jsx
import { useState } from "react";

const API =
  import.meta.env.VITE_API_URL || "https://coc-backend-eqfx.onrender.com";

function PlayerPage() {
  const [tag, setTag] = useState("");
  const [player, setPlayer] = useState(null);

  const fetchPlayer = async () => {
    const res = await fetch(`${API}/player/${tag}`);
    setPlayer(await res.json());
  };

  return (
    <div>
      <h2 className="text-2xl mb-4">👤 Search Player</h2>
      <input
        type="text"
        placeholder="Enter Player Tag (without #)"
        value={tag}
        onChange={(e) => setTag(e.target.value)}
        className="border p-2 mr-2 text-black"
      />
      <button
        onClick={fetchPlayer}
        className="bg-blue-600 px-4 py-2 rounded text-white"
      >
        Get Info
      </button>

      {player && (
        <div className="mt-6 p-4 border rounded bg-white dark:bg-gray-800">
          <h3 className="text-xl font-bold">
            {player.name} ({player.tag})
          </h3>
          <p>
            Town Hall: {player.townHallLevel} | XP Level: {player.expLevel}
          </p>
          <p>
            Trophies: {player.trophies} | Best: {player.bestTrophies}
          </p>
          <p>Clan: {player.clan?.name || "None"}</p>

          <h4 className="text-lg mt-4 font-bold">Troops</h4>
          <ul className="list-disc pl-5">
            {player.troops?.map((t) => (
              <li key={t.name}>
                {t.name} - Lv {t.level} / Max {t.maxLevel}
              </li>
            ))}
          </ul>

          <h4 className="text-lg mt-4 font-bold">Heroes</h4>
          <ul className="list-disc pl-5">
            {player.heroes?.map((h) => (
              <li key={h.name}>
                {h.name} - Lv {h.level}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default PlayerPage;
