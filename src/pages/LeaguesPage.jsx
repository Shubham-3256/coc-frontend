import { useState, useEffect } from "react";
import { CLAN_TAG, API_BASE } from "../config";
import { LineChart, Line, ResponsiveContainer } from "recharts";

// League tier colors
const TIER_COLOR = {
  Bronze: "#b77c4f",
  Silver: "#a9a9a9",
  Gold: "#d4af37",
  Crystal: "#64c2f1",
  Master: "#7b68ee",
  Champion: "#ff6347",
  Titan: "#4b0082",
  Legend: "#ff1493",
};

export default function LeaguesPage() {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    async function fetchMembers() {
      const res = await fetch(`${API_BASE}/clan/${CLAN_TAG}/members`);
      const data = (await res.json()).items || [];

      // Mock trophy history for sparkline
      data.forEach((m) => {
        m.trophyHistory = Array.from({ length: 7 }).map((_, i) => ({
          day: i + 1,
          trophies: m.trophies - Math.floor(Math.random() * 40),
        }));
      });

      // Sort members by trophies descending
      data.sort((a, b) => b.trophies - a.trophies);
      setMembers(data);
    }
    fetchMembers();
  }, []);

  return (
    <div className="px-4 md:px-8 py-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800">
        Clan Member Leagues
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((m, idx) => {
          const isTop3 = idx < 3;
          const tierColor = TIER_COLOR[m.league?.name] || "#888";

          return (
            <div
              key={m.tag}
              className={`relative p-5 bg-white/30 backdrop-blur-md shadow-md rounded-2xl transform transition-all duration-500 hover:scale-105 hover:shadow-xl hover:rotate-1 animate-fadeIn`}
              style={{
                borderLeft: `6px solid ${tierColor}`,
                boxShadow: `0 0 20px ${tierColor}33`,
                animationDelay: `${idx * 0.08}s`,
              }}
            >
              {/* Glowing League Header */}
              <div
                className="absolute top-0 left-0 w-full h-1 rounded-t-2xl"
                style={{
                  backgroundColor: tierColor,
                  boxShadow: `0 0 12px ${tierColor}`,
                }}
              />

              {/* Hover Sparkle for top 3 members */}
              {isTop3 && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="w-full h-full animate-sparkle bg-[radial-gradient(circle,rgba(255,255,255,0.15)0%,transparent 70%)] mix-blend-screen"></div>
                </div>
              )}

              {/* Header: Name + Rank + League Logo */}
              <div className="flex items-center justify-between mb-4 relative z-10">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">
                    {m.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Rank: {m.rank || "N/A"}
                  </p>
                </div>
                {m.league?.iconUrls?.medium && (
                  <img
                    src={m.league.iconUrls.medium}
                    alt={m.league.name}
                    className="w-10 h-10 rounded-full shadow-sm"
                  />
                )}
              </div>

              {/* Role Badge */}
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 mb-3 relative z-10">
                {m.role.toUpperCase()}
              </span>

              {/* Stats */}
              <div className="space-y-2 mb-3 relative z-10">
                <p className="flex justify-between text-sm text-gray-700">
                  <span>Trophies</span>
                  <span>{m.trophies}</span>
                </p>
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-gray-400 to-gray-600 transition-all duration-700"
                    style={{ width: `${(m.trophies / 6000) * 100}%` }}
                  ></div>
                </div>

                <p className="flex justify-between text-sm text-gray-700">
                  <span>Donations</span>
                  <span>{m.donations}</span>
                </p>
                <p className="flex justify-between text-sm text-gray-700">
                  <span>TH Level</span>
                  <span>{m.townHallLevel}</span>
                </p>
              </div>

              {/* Sparkline Chart */}
              <div className="h-20 relative z-10">
                <ResponsiveContainer>
                  <LineChart data={m.trophyHistory}>
                    <Line
                      type="monotone"
                      dataKey="trophies"
                      stroke={tierColor}
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* League Name */}
              <p className="mt-2 text-center text-sm text-gray-600 relative z-10">
                League: {m.league?.name || "N/A"}
              </p>
            </div>
          );
        })}
      </div>

      {/* Tailwind Sparkle Animation */}
      <style jsx>{`
        @keyframes sparkle {
          0% {
            transform: translate(0, 0);
            opacity: 0.3;
          }
          50% {
            transform: translate(5px, -5px);
            opacity: 0.6;
          }
          100% {
            transform: translate(0, 0);
            opacity: 0.3;
          }
        }
        .animate-sparkle {
          animation: sparkle 1.5s infinite;
        }
      `}</style>
    </div>
  );
}
