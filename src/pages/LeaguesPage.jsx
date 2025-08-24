import { useState, useEffect, useMemo } from "react";
import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";
import { CLAN_TAG, API_BASE } from "../config";

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
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterLeague, setFilterLeague] = useState("All");
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    async function fetchMembers() {
      try {
        const res = await fetch(`${API_BASE}/clan/${CLAN_TAG}/members`);
        const data = (await res.json()).items || [];

        // Mock trophy history
        data.forEach((m) => {
          m.trophyHistory = Array.from({ length: 7 }).map((_, i) => ({
            day: i + 1,
            trophies: m.trophies - Math.floor(Math.random() * 40),
          }));
        });

        data.sort((a, b) => b.trophies - a.trophies);
        setMembers(data);
      } catch (err) {
        console.error("Failed to fetch clan members:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchMembers();
  }, []);

  // Filtered & searched members
  const displayedMembers = useMemo(() => {
    return members.filter((m) => {
      const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase());
      const matchesLeague =
        filterLeague === "All" || m.league?.name === filterLeague;
      return matchesSearch && matchesLeague;
    });
  }, [members, search, filterLeague]);

  // Unique league options for dropdown
  const leagueOptions = [
    "All",
    ...new Set(members.map((m) => m.league?.name).filter(Boolean)),
  ];

  // Aggregate statistics
  const totalMembers = members.length;
  const avgTrophies = Math.round(
    members.reduce((sum, m) => sum + m.trophies, 0) / totalMembers || 0
  );
  const leagueCounts = members.reduce((acc, m) => {
    const league = m.league?.name || "N/A";
    acc[league] = (acc[league] || 0) + 1;
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="coc-container flex justify-center items-center h-[50vh]">
        <p className="text-gray-500 animate-pulse">Loading clan members...</p>
      </div>
    );
  }

  return (
    <div className="coc-container">
      <h1 className="coc-title mb-4 text-3xl sm:text-4xl text-center">
        🏅 Clan Member Leagues
      </h1>

      {/* Aggregate Stats */}
      <div className="flex flex-wrap gap-4 mb-6 justify-center text-sm text-gray-700 dark:text-gray-300">
        <span>Members: {totalMembers}</span>
        <span>Avg Trophies: {avgTrophies}</span>
        {Object.entries(leagueCounts).map(([league, count]) => (
          <span key={league}>
            {league}: {count}
          </span>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-3">
        <input
          type="text"
          placeholder="Search member..."
          className="coc-input w-full sm:w-1/2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-400 focus:outline-none 
               bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="coc-select w-full sm:w-1/3 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-400 focus:outline-none 
               bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          value={filterLeague}
          onChange={(e) => setFilterLeague(e.target.value)}
        >
          {leagueOptions.map((league) => (
            <option
              key={league}
              value={league}
              className="dark:bg-gray-800 dark:text-gray-100"
            >
              {league}
            </option>
          ))}
        </select>
      </div>

      {/* Member Cards */}
      {displayedMembers.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center mt-10 transition-colors duration-300">
          No members match your search/filter.
        </p>
      ) : (
        <div className="overflow-x-auto sm:overflow-x-visible">
          <div className="flex gap-4 min-w-max sm:grid sm:grid-cols-1 sm:gap-6 lg:grid-cols-3">
            {displayedMembers.map((m, idx) => {
              const tierColor = TIER_COLOR[m.league?.name] || "#888";
              const lastTrophy =
                m.trophyHistory[m.trophyHistory.length - 1]?.trophies ||
                m.trophies;
              const prevTrophy =
                m.trophyHistory[m.trophyHistory.length - 2]?.trophies ||
                lastTrophy;
              const diff = lastTrophy - prevTrophy;

              return (
                <div
                  key={m.tag}
                  className="relative rounded-lg bg-white dark:bg-gray-800 p-4 animate-fadeIn shadow-lg hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 border-l-4 overflow-hidden cursor-pointer min-w-[250px]"
                  style={{ borderLeftColor: tierColor }}
                  onClick={() => setSelectedMember(m)}
                >
                  {/* Glow for top 3 */}
                  {idx < 3 && (
                    <div
                      className="absolute inset-0 rounded-lg pointer-events-none"
                      style={{
                        boxShadow: `0 0 25px 5px ${tierColor}55`,
                      }}
                    ></div>
                  )}

                  {/* Header */}
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 truncate">
                      {m.name}
                    </h3>
                    {m.league?.iconUrls?.medium && (
                      <img
                        src={m.league.iconUrls.medium}
                        alt={m.league.name}
                        className="w-12 h-12 rounded-full border border-gray-300 dark:border-gray-600"
                      />
                    )}
                  </div>

                  {/* Rank & Role */}
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      Rank: {m.rank}
                    </span>
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        m.role === "leader"
                          ? "bg-red-200 dark:bg-red-700 text-red-800 dark:text-red-200"
                          : m.role === "coLeader"
                          ? "bg-yellow-200 dark:bg-yellow-700 text-yellow-800 dark:text-yellow-200"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                      }`}
                    >
                      {m.role}
                    </span>
                  </div>

                  {/* Trophy Sparkline */}
                  <div className="h-20 mt-1 mb-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={m.trophyHistory}>
                        <defs>
                          <linearGradient
                            id={`lineGradient-${m.tag}`}
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor={tierColor}
                              stopOpacity={1}
                            />
                            <stop
                              offset="100%"
                              stopColor={tierColor}
                              stopOpacity={0.3}
                            />
                          </linearGradient>
                        </defs>
                        <Line
                          type="monotone"
                          dataKey="trophies"
                          stroke={`url(#lineGradient-${m.tag})`}
                          strokeWidth={3}
                          dot={{ r: 2 }}
                          activeDot={{ r: 5 }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1f2937",
                            border: "none",
                            borderRadius: "8px",
                            color: "#fff",
                            fontSize: "0.875rem",
                          }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* League & Trophies */}
                  <div className="mt-2 space-y-1">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      League:{" "}
                      <span style={{ color: tierColor }}>
                        {m.league?.name || "N/A"}
                      </span>
                    </p>
                    <p className="text-sm flex items-center gap-1 text-gray-500 dark:text-gray-400">
                      Trophies: {lastTrophy.toLocaleString()}
                      {diff > 0 && (
                        <span className="text-green-500 font-bold">
                          ▲ {diff}
                        </span>
                      )}
                      {diff < 0 && (
                        <span className="text-red-500 font-bold">
                          ▼ {Math.abs(diff)}
                        </span>
                      )}
                      {diff === 0 && (
                        <span className="text-gray-400 font-bold">–</span>
                      )}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Member Modal */}
      {selectedMember && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl max-w-lg w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-600 dark:text-gray-300 text-xl font-bold"
              onClick={() => setSelectedMember(null)}
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4">{selectedMember.name}</h2>

            {/* Trophy Chart */}
            <div className="h-40 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={selectedMember.trophyHistory}>
                  <Line
                    type="monotone"
                    dataKey="trophies"
                    stroke="#4f46e5"
                    strokeWidth={3}
                    dot={{ r: 2 }}
                  />
                  <Tooltip />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Additional Stats */}
            <div className="space-y-2 text-gray-700 dark:text-gray-300">
              <p>Role: {selectedMember.role}</p>
              <p>Rank: {selectedMember.rank}</p>
              <p>League: {selectedMember.league?.name || "N/A"}</p>
              <p>Clan Wars: {selectedMember.clanWars || "N/A"}</p>
              <p>Achievements: {selectedMember.achievements || "N/A"}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
