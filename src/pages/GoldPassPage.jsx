import { useState, useEffect } from "react";
import { API_BASE } from "../config";

export default function GoldPassPage() {
  const [goldPass, setGoldPass] = useState(null);

  useEffect(() => {
    async function fetchGoldPass() {
      const res = await fetch(`${API_BASE}/goldpass/current`);
      setGoldPass(await res.json());
    }
    fetchGoldPass();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 animate-fadeIn">Gold Pass</h1>
      {goldPass && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {goldPass.items?.map((item, idx) => (
            <div
              key={idx}
              className="p-4 bg-white shadow rounded hover:shadow-lg transition-shadow duration-300 animate-fadeIn"
            >
              <h3 className="font-semibold">{item.name}</h3>
              <p>Tier: {item.tier}</p>
              <p>Type: {item.type}</p>
              <p>Reward Claimed: {item.isRewardClaimed ? "Yes" : "No"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
