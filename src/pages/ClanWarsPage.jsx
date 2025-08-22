import React, { useState } from "react";

const API_BASE = "https://coc-backend-eqfx.onrender.com";

export default function ClanWarsPage() {
  const [tag, setTag] = useState("");
  const [warlog, setWarlog] = useState(null);
  const [currentWar, setCurrentWar] = useState(null);
  const [rounds, setRounds] = useState(null);

  const fetchWarlog = async () => {
    const res = await fetch(`${API_BASE}/clan/${tag}/warlog`);
    setWarlog(await res.json());
  };

  const fetchCurrentWar = async () => {
    const res = await fetch(`${API_BASE}/clan/${tag}/currentwar`);
    setCurrentWar(await res.json());
  };

  const fetchRounds = async () => {
    const res = await fetch(`${API_BASE}/clan/${tag}/rounds`);
    setRounds(await res.json());
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Clan Wars</h1>

      <input
        type="text"
        placeholder="Enter clan tag (e.g. 2PP)"
        value={tag}
        onChange={(e) => setTag(e.target.value)}
        className="border p-2 mr-2"
      />

      <div className="flex gap-2 mt-2">
        <button
          onClick={fetchWarlog}
          className="bg-blue-600 text-white px-4 py-2"
        >
          War Log
        </button>
        <button
          onClick={fetchCurrentWar}
          className="bg-green-600 text-white px-4 py-2"
        >
          Current War
        </button>
        <button
          onClick={fetchRounds}
          className="bg-purple-600 text-white px-4 py-2"
        >
          CWL Rounds
        </button>
      </div>

      {warlog && (
        <div className="mt-4">
          <h2 className="font-semibold">War Log</h2>
          <pre className="bg-gray-200 p-4 rounded">
            {JSON.stringify(warlog, null, 2)}
          </pre>
        </div>
      )}

      {currentWar && (
        <div className="mt-4">
          <h2 className="font-semibold">Current War</h2>
          <pre className="bg-gray-200 p-4 rounded">
            {JSON.stringify(currentWar, null, 2)}
          </pre>
        </div>
      )}

      {rounds && (
        <div className="mt-4">
          <h2 className="font-semibold">CWL Rounds</h2>
          <pre className="bg-gray-200 p-4 rounded">
            {JSON.stringify(rounds, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
