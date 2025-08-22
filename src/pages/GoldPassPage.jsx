import React, { useEffect, useState } from "react";

const API_BASE = "https://coc-backend-eqfx.onrender.com";

export default function GoldPassPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/goldpass`)
      .then((res) => res.json())
      .then((json) => setData(json));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold">Gold Pass</h1>
      {data ? (
        <pre className="bg-gray-200 p-4 mt-4 rounded">
          {JSON.stringify(data, null, 2)}
        </pre>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
