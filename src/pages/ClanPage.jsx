import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Line,
  Legend,
  LineChart,
} from "recharts";

import { CLAN_TAG, API_BASE } from "../config";

const ROLE_COLOR = {
  leader: "bg-yellow-500 text-black",
  coLeader: "bg-gray-400 text-black",
  elder: "bg-blue-400 text-white",
  member: "bg-green-400 text-black",
};

const TH_COLOR = {
  1: "bg-gray-500 text-white",
  2: "bg-yellow-500 text-black",
  3: "bg-orange-500 text-white",
  4: "bg-red-500 text-white",
  5: "bg-pink-500 text-white",
  6: "bg-purple-500 text-white",
  7: "bg-indigo-500 text-white",
  8: "bg-blue-500 text-white",
  9: "bg-cyan-500 text-black",
  10: "bg-green-500 text-white",
  11: "bg-lime-500 text-black",
  12: "bg-amber-500 text-black",
  13: "bg-rose-500 text-white",
  14: "bg-fuchsia-500 text-white",
  15: "bg-violet-500 text-white",
  16: "bg-pink-700 text-white",
  17: "bg-indigo-700 text-white",
};

// Helpers
const clamp01 = (n) => (Number.isFinite(n) ? Math.max(0, Math.min(1, n)) : 0);
const safe = (n, fallback = 0) => (Number.isFinite(n) ? n : fallback);

// Two-sided comparison bar: left (clan) fills from left → center, right (opponent) fills from right → center
function HalfComparisonBar({
  leftValue = 0,
  leftMax = 1,
  rightValue = 0,
  rightMax = 1,
  leftClass = "bg-green-500",
  rightClass = "bg-red-500",
  trackClass = "bg-gray-700",
  height = "h-3",
}) {
  // Each side can fill up to 50% of the track (their own half)
  const leftPctHalf = clamp01(leftMax > 0 ? leftValue / leftMax : 0) * 50;
  const rightPctHalf = clamp01(rightMax > 0 ? rightValue / rightMax : 0) * 50;

  return (
    <div
      className={`relative w-full overflow-hidden rounded-full ${trackClass} ${height}`}
    >
      {/* Left half fill (your clan) */}
      <div
        className={`absolute left-0 top-0 ${height} ${leftClass}`}
        style={{ width: `${leftPctHalf}%` }}
      />
      {/* Right half fill (opponent) */}
      <div
        className={`absolute right-0 top-0 ${height} ${rightClass}`}
        style={{ width: `${rightPctHalf}%` }}
      />
    </div>
  );
}
function BouncingEmoji({ children, className = "" }) {
  return (
    <span className={`text-3xl animate-bounce inline-block ${className}`}>
      {children}
    </span>
  );
}

export default function ClanPage() {
  const [clan, setClan] = useState(null);
  const [members, setMembers] = useState([]);
  const [warlog, setWarlog] = useState([]);
  const [currentWar, setCurrentWar] = useState(null);

  useEffect(() => {
    async function fetchClanData() {
      const [clanRes, membersRes, warlogRes, currentWarRes] = await Promise.all(
        [
          fetch(`${API_BASE}/clan/${CLAN_TAG}`),
          fetch(`${API_BASE}/clan/${CLAN_TAG}/members`),
          fetch(`${API_BASE}/clan/${CLAN_TAG}/warlog`),
          fetch(`${API_BASE}/clan/${CLAN_TAG}/currentwar`),
        ]
      );
      setClan(await clanRes.json());
      setMembers((await membersRes.json()).items || []);
      setWarlog((await warlogRes.json()).items || []);
      setCurrentWar(await currentWarRes.json());
    }
    fetchClanData();
  }, []);

  const chartData = warlog.map((w, idx) => ({
    war: `War ${idx + 1}`,
    clanStars: w.clan.stars,
    oppStars: w.opponent.stars,
    destruction: w.clan.destructionPercentage,
  }));

  return (
    <div className="coc-container">
      <h1 className="coc-title animate-fadeIn">🏰 Clan Overview</h1>

      {/* 🌟 Clan Info Card */}
      {clan && (
        <div className="relative mb-8 animate-fadeIn">
          {/* Glow background */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-500/20 via-blue-500/20 to-purple-600/20 blur-2xl opacity-60 animate-pulse"></div>

          {/* Main card */}
          <div className="relative z-10 bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-700/60 hover:border-yellow-400/40 transition-all duration-500">
            <div className="flex items-center gap-4 mb-6">
              {clan.badgeUrls?.medium && (
                <img
                  src={clan.badgeUrls.medium}
                  alt="Clan Badge"
                  className="w-16 h-16 rounded-lg shadow-lg" // no yellow border
                />
              )}
              <div>
                <h2 className="text-3xl font-extrabold text-white flex items-center gap-3">
                  {clan.name}
                </h2>
                <p className="text-sm text-gray-400">{clan.tag}</p>
              </div>
            </div>

            {clan.description && (
              <p className="text-gray-300 text-sm italic mb-6 max-h-20 overflow-y-auto">
                "{clan.description}"
              </p>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 text-gray-200">
              <div className="flex flex-col items-center bg-gradient-to-br from-yellow-500/10 to-yellow-700/10 p-4 rounded-xl shadow-inner hover:scale-105 transition">
                <div className="text-3xl animate-bounce">⭐</div>
                <p className="font-bold text-xl text-yellow-400">
                  {clan.clanLevel}
                </p>
                <p className="text-xs text-gray-400">Level</p>
              </div>

              <div className="flex flex-col items-center bg-gradient-to-br from-blue-500/10 to-blue-700/10 p-4 rounded-xl shadow-inner hover:scale-105 transition">
                <BouncingEmoji>👥</BouncingEmoji>

                <p className="font-bold text-xl text-blue-400">
                  {clan.members}
                </p>
                <p className="text-xs text-gray-400">Members</p>
              </div>

              <div className="flex flex-col items-center bg-gradient-to-br from-emerald-500/10 to-emerald-700/10 p-4 rounded-xl shadow-inner hover:scale-105 transition">
                <BouncingEmoji>🏆</BouncingEmoji>
                <p className="font-bold text-xl text-emerald-400">
                  {clan.clanPoints}
                </p>
                <p className="text-xs text-gray-400">Trophies</p>
              </div>

              <div className="flex flex-col items-center bg-gradient-to-br from-purple-500/10 to-purple-700/10 p-4 rounded-xl shadow-inner hover:scale-105 transition">
                <BouncingEmoji>⚔️</BouncingEmoji>
                <p className="font-bold text-sm text-purple-400 text-center">
                  {clan.warFrequency}
                </p>
                <p className="text-xs text-gray-400">War Freq</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 👥 Members Grid */}
      {members.length > 0 && (
        <div className="mb-10 animate-fadeIn">
          <h3 className="coc-subtitle">👥 Clan Members</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((m) => (
              <div
                key={m.tag}
                className="coc-card hover:shadow-xl transition-all transform hover:scale-[1.03]"
              >
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold text-lg truncate">{m.name}</h4>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide shadow-sm ${
                      ROLE_COLOR[m.role] || "bg-gray-600 text-white"
                    }`}
                  >
                    {m.role.toUpperCase()}
                  </span>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  {/* League Icon */}
                  {m.league?.iconUrls?.tiny ? (
                    <img
                      src={m.league.iconUrls.tiny}
                      alt={m.league.name}
                      className="w-8 h-8 rounded-full shadow"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-xs text-gray-300">
                      N/A
                    </div>
                  )}

                  {/* Town Hall with Glow */}
                  <div
                    className={`flex items-center gap-2 px-2 py-1 rounded text-xs font-semibold transition-all duration-300
                ${TH_COLOR[m.townHallLevel] || "bg-gray-700 text-gray-200"}
                hover:scale-110 hover:shadow-[0_0_15px_${
                  TH_COLOR[m.townHallLevel]?.replace("bg-", "#") || "#fff"
                }]`}
                  >
                    <img
                      src={`/townhalls/th${m.townHallLevel}.png`} // put images in public/townhalls/
                      alt={`TH ${m.townHallLevel}`}
                      className="w-5 h-5"
                    />
                    <span>TH {m.townHallLevel}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="space-y-3">
                  {/* Trophies */}
                  <div>
                    <p className="text-sm text-gray-400 flex justify-between">
                      <span>🏆 Trophies</span>
                      <span className="font-semibold text-gray-200">
                        {m.trophies}
                      </span>
                    </p>
                    <div className="bg-gray-700 h-2 w-full rounded mt-1">
                      <div
                        className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-2 rounded transition-all duration-700"
                        style={{ width: `${(m.trophies / 6000) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Donations */}
                  <div>
                    <p className="text-sm text-gray-400 flex justify-between">
                      <span>📤 Donations</span>
                      <span className="font-semibold text-gray-200">
                        {m.donations}
                      </span>
                    </p>
                    <div className="bg-gray-700 h-2 w-full rounded mt-1">
                      <div
                        className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded transition-all duration-700"
                        style={{ width: `${(m.donations / 5000) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Optional Sparkline */}
                {m.trophyHistory && (
                  <div className="h-16 mt-4">
                    <ResponsiveContainer>
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
            ))}
          </div>
        </div>
      )}

      {/* 📊 War Log Performance */}
      {chartData.length > 0 && (
        <div className="coc-card mb-8 h-80 animate-fadeIn">
          <h3 className="coc-subtitle flex items-center gap-2">
            📊 War Log Performance
          </h3>
          <ResponsiveContainer>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="war" stroke="#9ca3af" tick={{ fontSize: 12 }} />
              <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  background: "#1e293b",
                  border: "1px solid #374151",
                  borderRadius: "0.5rem",
                  color: "#f9fafb",
                }}
                formatter={(value, name) => {
                  if (name === "destruction")
                    return [`${value}%`, "Destruction"];
                  return [value, name];
                }}
              />
              <Legend
                wrapperStyle={{ color: "#d1d5db" }}
                verticalAlign="top"
                height={36}
              />
              <Bar
                dataKey="clanStars"
                name="Clan Stars"
                fill="url(#clanGradient)"
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey="oppStars"
                name="Opponent Stars"
                fill="url(#oppGradient)"
                radius={[6, 6, 0, 0]}
              />
              <Line
                type="monotone"
                dataKey="destruction"
                stroke="#38bdf8"
                strokeWidth={2.5}
                dot={{
                  r: 4,
                  fill: "#38bdf8",
                  stroke: "#0ea5e9",
                  strokeWidth: 1,
                }}
                activeDot={{
                  r: 6,
                  fill: "#f9fafb",
                  stroke: "#38bdf8",
                  strokeWidth: 2,
                }}
                name="Destruction %"
              />
              <defs>
                <linearGradient id="clanGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.9} />
                  <stop offset="95%" stopColor="#15803d" stopOpacity={0.7} />
                </linearGradient>
                <linearGradient id="oppGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.9} />
                  <stop offset="95%" stopColor="#991b1b" stopOpacity={0.7} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* ⚔️ Current War */}
      {currentWar && (
        <div className="relative mb-8 animate-fadeIn">
          {/* Glow background */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-500/20 via-purple-500/20 to-blue-500/20 blur-2xl opacity-60 animate-pulse"></div>
          {/* Main card */}
          <div className="relative z-10 bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-700/60 hover:border-red-400/40 transition-all duration-500">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                ⚔️ Current War
              </h3>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide shadow-md ${
                  currentWar.state === "inWar"
                    ? "bg-red-500/90 text-white animate-pulse"
                    : currentWar.state === "preparation"
                    ? "bg-yellow-500/90 text-black"
                    : "bg-gray-600 text-gray-100"
                }`}
              >
                {currentWar.state.toUpperCase()}
              </span>
            </div>

            {currentWar.clan && currentWar.opponent && (
              <div className="space-y-6 mt-6">
                {/* ⭐ Stars (each half shows progress to its own max) */}
                <div>
                  <p className="text-sm text-gray-400 mb-2">⭐ Stars</p>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-yellow-400">
                      {safe(currentWar.clan?.stars, 0)}
                    </span>
                    <HalfComparisonBar
                      leftValue={safe(currentWar.clan?.stars, 0)}
                      leftMax={safe(currentWar.teamSize, 0) * 3}
                      rightValue={safe(currentWar.opponent?.stars, 0)}
                      rightMax={safe(currentWar.teamSize, 0) * 3}
                      leftClass="bg-gradient-to-r from-green-400 to-green-600"
                      rightClass="bg-gradient-to-r from-red-400 to-red-600"
                    />
                    <span className="font-bold text-red-400">
                      {safe(currentWar.opponent?.stars, 0)}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-gray-400 text-center">
                    Each side fills its own half (max stars per side = teamSize
                    × 3)
                  </p>
                </div>

                {/* 💥 Destruction % (each half shows progress to 100%) */}
                <div>
                  <p className="text-sm text-gray-400 mb-2">💥 Destruction %</p>
                  <div className="flex items-center justify-between text-gray-200 mb-1">
                    <span className="text-green-400 font-semibold">
                      {safe(currentWar.clan?.destructionPercentage, 0).toFixed(
                        1
                      )}
                      %
                    </span>
                    <span className="text-red-400 font-semibold">
                      {safe(
                        currentWar.opponent?.destructionPercentage,
                        0
                      ).toFixed(1)}
                      %
                    </span>
                  </div>
                  <HalfComparisonBar
                    leftValue={safe(currentWar.clan?.destructionPercentage, 0)}
                    leftMax={100}
                    rightValue={safe(
                      currentWar.opponent?.destructionPercentage,
                      0
                    )}
                    rightMax={100}
                    leftClass="bg-green-500"
                    rightClass="bg-red-500"
                  />
                </div>

                {/* 📊 Attacks */}
                <div className="grid grid-cols-2 gap-4 text-gray-200 text-center">
                  <div className="bg-gradient-to-br from-green-500/10 to-green-700/10 p-4 rounded-xl">
                    <p className="text-lg font-bold text-green-400">
                      {safe(currentWar.clan?.attacks, 0)}
                    </p>
                    <p className="text-xs text-gray-400">Clan Attacks</p>
                  </div>
                  <div className="bg-gradient-to-br from-red-500/10 to-red-700/10 p-4 rounded-xl">
                    <p className="text-lg font-bold text-red-400">
                      {safe(currentWar.opponent?.attacks, 0)}
                    </p>
                    <p className="text-xs text-gray-400">Opponent Attacks</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
