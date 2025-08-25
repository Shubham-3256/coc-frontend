import { useState, useEffect, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { CLAN_TAG, API_BASE } from "../config";

// Role colors (optional)
const ROLE_COLOR = {
  leader: "Leader",
  coLeader: "Co-Leader",
  elder: "Elder",
  member: "Member",
};

// TH colors mapping
const TH_COLOR = {
  1: "bg-gray-500 text-white",
  2: "bg-gray-600 text-white",
  3: "bg-yellow-500 text-white",
  4: "bg-yellow-600 text-white",
  5: "bg-orange-500 text-white",
  6: "bg-orange-600 text-white",
  7: "bg-red-500 text-white",
  8: "bg-red-600 text-white",
  9: "bg-pink-500 text-white",
  10: "bg-pink-600 text-white",
  11: "bg-purple-500 text-white",
  12: "bg-purple-600 text-white",
  13: "bg-indigo-500 text-white",
  14: "bg-indigo-600 text-white",
  15: "bg-blue-500 text-white",
  16: "bg-blue-600 text-white",
  17: "bg-green-500 text-white",
};

export default function LeaderboardsPage() {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("trophies");
  const [currentPage, setCurrentPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState("all");
  const [thFilter, setThFilter] = useState("all");
  const itemsPerPage = 10;

  // Fetch members
  useEffect(() => {
    async function fetchMembers() {
      const res = await fetch(`${API_BASE}/clan/${CLAN_TAG}/members`);
      const data = (await res.json()).items || [];
      data.forEach((m) => {
        if (!m.trophyHistory) {
          m.trophyHistory = Array.from({ length: 7 }, (_, i) => ({
            trophies: m.trophies - 50 * i,
          })).reverse();
        }
      });
      setMembers(data);
    }
    fetchMembers();
  }, []);

  // Filter & sort
  const filteredMembers = useMemo(() => {
    let data = [...members];
    if (search)
      data = data.filter((m) =>
        m.name.toLowerCase().includes(search.toLowerCase())
      );
    if (roleFilter !== "all") data = data.filter((m) => m.role === roleFilter);
    if (thFilter !== "all")
      data = data.filter((m) => Number(m.townHallLevel) === Number(thFilter));
    if (sortBy === "trophies") data.sort((a, b) => b.trophies - a.trophies);
    if (sortBy === "donations") data.sort((a, b) => b.donations - a.donations);
    if (sortBy === "name") data.sort((a, b) => a.name.localeCompare(b.name));
    return data;
  }, [members, search, roleFilter, thFilter, sortBy]);

  // Pagination
  const paginatedMembers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredMembers.slice(start, start + itemsPerPage);
  }, [filteredMembers, currentPage]);

  return (
    <div className="coc-container">
      <h1 className="coc-title animate-fadeIn">🏆 Leaderboards</h1>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4 sm:items-center sm:justify-between flex-wrap">
        <input
          type="text"
          placeholder="Search member..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 rounded-lg border border-gray-600 bg-gray-800 text-white w-full sm:w-64 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="p-2 rounded-lg border border-gray-600 bg-gray-800 text-white w-full sm:w-48 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        >
          <option value="trophies">Sort by Trophies</option>
          <option value="donations">Sort by Donations</option>
          <option value="name">Sort by Name</option>
        </select>

        {/* Quick Filters */}
        <div className="flex gap-2 flex-wrap">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="p-2 rounded-lg border border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <option value="all">All Roles</option>
            <option value="leader">Leader</option>
            <option value="coLeader">Co-Leader</option>
            <option value="elder">Elder</option>
            <option value="member">Member</option>
          </select>

          <select
            value={thFilter}
            onChange={(e) => setThFilter(e.target.value)}
            className="p-2 rounded-lg border border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="all">All TH</option>
            {Array.from({ length: 17 }, (_, i) => i + 1).map((th) => (
              <option key={th} value={th}>
                TH {th}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Leaderboard BarChart */}
      <div className="coc-card bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-xl p-4 h-[500px] hover:shadow-2xl transition-all overflow-x-auto">
        <ResponsiveContainer
          width={
            paginatedMembers.length > 10
              ? paginatedMembers.length * 100
              : "100%"
          }
          height="100%"
        >
          <BarChart
            layout="vertical"
            data={paginatedMembers.map((m, i) => ({
              ...m,
              rank: i + 1 + (currentPage - 1) * itemsPerPage,
            }))}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            {/* Gradients */}
            <defs>
              <linearGradient id="rank1Gradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#16a34a" />
              </linearGradient>
              <linearGradient id="rank2Gradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#0ea5e9" />
              </linearGradient>
              <linearGradient id="rank3Gradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#db2777" />
              </linearGradient>
            </defs>

            <XAxis type="number" stroke="#9ca3af" />
            <YAxis
              dataKey="name"
              type="category"
              width={140}
              stroke="#9ca3af"
              tick={{ fontSize: 12 }}
            />

            {/* Tooltip */}
            <Tooltip
              content={({ payload }) => {
                if (!payload || !payload.length) return null;
                const m = payload[0]?.payload;
                if (!m) return null;
                return (
                  <div className="bg-gray-800 text-white p-2 rounded shadow-lg max-w-xs">
                    <p className="font-bold">
                      {m.name} | TH{m.townHallLevel}
                    </p>
                    <p>🏆 Trophies: {m.trophies}</p>
                    <p>📤 Donations: {m.donations}</p>
                    {m.trophyHistory?.length > 0 && (
                      <div className="h-16 mt-1">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={m.trophyHistory}>
                            <Line
                              type="monotone"
                              dataKey="trophies"
                              stroke="#facc15"
                              strokeWidth={2}
                              dot={false}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </div>
                );
              }}
            />

            <Bar dataKey="trophies" barSize={22} radius={[0, 12, 12, 0]}>
              {paginatedMembers.map((entry, index) => {
                const rank = index + 1 + (currentPage - 1) * itemsPerPage;
                let fill = "#f59e0b";
                if (rank === 1) fill = "url(#rank1Gradient)";
                else if (rank === 2) fill = "url(#rank2Gradient)";
                else if (rank === 3) fill = "url(#rank3Gradient)";
                return <Cell key={`cell-${index}`} fill={fill} />;
              })}

              <LabelList
                dataKey="trophies"
                position="right"
                formatter={(value, name, props) => {
                  const rank = props?.payload?.rank ?? value;
                  return `${value}`;
                }}
                style={{ fill: "#facc15", fontWeight: "bold", fontSize: 12 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Mini Sparkline Cards */}
      {/* Mini Sparkline Cards - Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {paginatedMembers.map((m, index) => {
          const rank = index + 1 + (currentPage - 1) * itemsPerPage;
          const trendColor =
            m.trophyHistory &&
            m.trophyHistory.length > 1 &&
            m.trophyHistory[m.trophyHistory.length - 1].trophies >=
              m.trophyHistory[0].trophies
              ? "#22c55e"
              : "#ef4444";

          let rankBadge = null;
          if (rank === 1) rankBadge = "👑";
          else if (rank === 2) rankBadge = "🥈";
          else if (rank === 3) rankBadge = "🥉";

          return (
            <div
              key={m.tag}
              className="relative bg-gray-800/80 backdrop-blur-md rounded-2xl p-4 hover:scale-[1.03] hover:shadow-lg transition-all duration-300"
            >
              {/* Member Header */}
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-gray-200 truncate flex items-center gap-1">
                  {m.name} {rankBadge && <span>{rankBadge}</span>}
                </span>
                <span
                  className={`text-xs font-bold px-2 py-1 rounded-full ${
                    TH_COLOR[m.townHallLevel] || "bg-gray-600 text-white"
                  }`}
                >
                  TH{m.townHallLevel}
                </span>
              </div>

              {/* Sparkline */}
              <ResponsiveContainer width="100%" height={40}>
                <LineChart data={m.trophyHistory}>
                  <defs>
                    <linearGradient
                      id={`sparkGradient-${m.tag}`}
                      x1="0"
                      y1="0"
                      x2="1"
                      y2="0"
                    >
                      <stop offset="0%" stopColor={trendColor} />
                      <stop offset="100%" stopColor={trendColor} />
                    </linearGradient>
                  </defs>
                  <Line
                    type="monotone"
                    dataKey="trophies"
                    stroke={`url(#sparkGradient-${m.tag})`}
                    strokeWidth={2}
                    dot={false}
                    animationDuration={800}
                  />
                </LineChart>
              </ResponsiveContainer>

              {/* Mini Stats */}
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>🏆 {m.trophies}</span>
                <span>📤 {m.donations}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {filteredMembers.length > itemsPerPage && (
        <div className="flex justify-center mt-4 gap-2 flex-wrap">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1 rounded-md bg-gray-700 text-white hover:bg-gray-600 transition"
          >
            Prev
          </button>
          {Array.from(
            { length: Math.ceil(filteredMembers.length / itemsPerPage) },
            (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded-md transition-all ${
                  currentPage === i + 1
                    ? "bg-yellow-500 text-black shadow-lg"
                    : "bg-gray-700 text-white hover:bg-gray-600"
                }`}
              >
                {i + 1}
              </button>
            )
          )}
          <button
            onClick={() =>
              setCurrentPage((p) =>
                Math.min(
                  Math.ceil(filteredMembers.length / itemsPerPage),
                  p + 1
                )
              )
            }
            className="px-3 py-1 rounded-md bg-gray-700 text-white hover:bg-gray-600 transition"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
