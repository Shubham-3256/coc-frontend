import { useState, useEffect } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  Legend,
  PolarRadiusAxis,
  ScatterChart,
  Scatter,
  CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";
import { CLAN_TAG, API_BASE } from "../config";
function BouncingEmoji({ children, className = "" }) {
  return (
    <span className={`text-3xl animate-bounce inline-block ${className}`}>
      {children}
    </span>
  );
}
export default function ClanWarsPage() {
  const [currentWar, setCurrentWar] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`${API_BASE}/clan/${CLAN_TAG}/currentwar`);
        setCurrentWar(await res.json());
      } catch (err) {
        console.error("Error fetching war data:", err);
      }
    }
    fetchData();
  }, []);

  if (!currentWar || !currentWar.clan) {
    return (
      <p className="text-gray-400 text-center text-lg mt-10">
        ⚔️ No current war data available.
      </p>
    );
  }

  const { clan, opponent } = currentWar;

  // === Data ===
  const radarData = [
    { stat: "Stars", value: clan.stars },
    { stat: "Attacks", value: clan.attacks || 0 },
    { stat: "Destruction %", value: clan.destructionPercentage },
    { stat: "Exp Earned", value: clan.expEarned },
  ];

  const barData = [
    {
      name: clan.name,
      stars: clan.stars,
      destruction: clan.destructionPercentage,
    },
    {
      name: opponent.name,
      stars: opponent.stars,
      destruction: opponent.destructionPercentage,
    },
  ];

  const pieData = [
    { name: `${clan.name} Stars`, value: clan.stars },
    { name: `${opponent.name} Stars`, value: opponent.stars },
  ];

  const COLORS = ["#22c55e", "#ef4444"];

  // Attackers & defenders
  const topAttackers =
    clan.members
      ?.map((m) => ({
        name: m.name,
        attacks: m.attacks?.length || 0,
        stars: m.attacks?.reduce((sum, a) => sum + a.stars, 0) || 0,
      }))
      .sort((a, b) => b.stars - a.stars)
      .slice(0, 3) || [];

  const topDefenders =
    clan.members
      ?.map((m) => ({
        name: m.name,
        defenses: m.defenses?.length || 0,
        starsLost: m.defenses?.reduce((sum, d) => sum + d.stars, 0) || 0,
      }))
      .sort((a, b) => a.starsLost - b.starsLost)
      .slice(0, 3) || [];

  // === Helper: War status ===
  const getWarStatus = () => {
    if (!currentWar) return "⚔️ No War Data";

    switch (currentWar.state) {
      case "preparation":
        return "⚔️ War Preparation is Underway!";
      case "inWar":
        if (clan.stars > opponent.stars) return "🔥 Your Clan is Winning!";
        if (clan.stars < opponent.stars) return "⚠️ Your Clan is Behind!";
        return "⚖️ It's a Tie!";
      case "warEnded":
        if (clan.stars > opponent.stars) return "🏆 Your Clan Won!";
        if (clan.stars < opponent.stars) return "💀 Your Clan Lost!";
        return "🤝 It's a Draw!";
      default:
        return "❓ Unknown War State";
    }
  };

  // === Animations ===
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="coc-container space-y-8">
      {/* Title */}
      <motion.h1
        className="coc-title text-4xl font-extrabold text-center bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent drop-shadow-lg"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        ⚔️ {clan.name} vs {opponent.name}
      </motion.h1>

      {/* War Status Banner */}
      <motion.div
        className="rounded-2xl p-4 text-center font-bold text-xl shadow-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white tracking-wide"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {getWarStatus()}
      </motion.div>

      {/* Clan vs Opponent Scoreboard */}
      <motion.div
        className="coc-card h-40 flex items-center justify-between px-6 border border-gray-700"
        variants={fadeIn}
        initial="hidden"
        animate="show"
      >
        <div className="text-center">
          <h3 className="text-lg font-bold text-green-400">{clan.name}</h3>
          <p className="text-4xl font-extrabold">
            {clan.stars} <BouncingEmoji>⭐</BouncingEmoji>
          </p>
          <p className="text-sm text-gray-400">
            {clan.attacksUsed}/{clan.attacks} Attacks
          </p>
        </div>
        <div className="text-2xl font-bold">VS</div>
        <div className="text-center">
          <h3 className="text-lg font-bold text-red-400">{opponent.name}</h3>
          <p className="text-4xl font-extrabold">
            {opponent.stars} <BouncingEmoji>⭐</BouncingEmoji>
          </p>
          <p className="text-sm text-gray-400">
            {opponent.attacksUsed}/{opponent.attacks} Attacks
          </p>
        </div>
      </motion.div>

      {/* Radar Chart */}
      <motion.div
        className="coc-card h-96"
        variants={fadeIn}
        initial="hidden"
        animate="show"
      >
        <h2 className="text-xl font-bold mb-4 text-center text-green-400 drop-shadow-md">
          📊 Clan Performance
        </h2>
        <ResponsiveContainer>
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
            {/* Grid */}
            <PolarGrid stroke="#555" strokeDasharray="3 3" />

            {/* Axis labels */}
            <PolarAngleAxis
              dataKey="stat"
              stroke="#ddd"
              tick={{ fill: "#ddd", fontSize: 12, fontWeight: 500 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]} // scale from 0 to 100
              stroke="#777"
              tick={{ fill: "#aaa", fontSize: 10 }}
            />

            {/* Tooltip */}
            <Tooltip
              contentStyle={{
                background: "#1f2937",
                border: "1px solid #374151",
                borderRadius: "8px",
                color: "#fff",
                fontSize: "12px",
              }}
            />

            {/* Radar */}
            <Radar
              name="Clan Performance"
              dataKey="value"
              stroke="#22c55e"
              fill="#22c55e"
              fillOpacity={0.5}
              animationDuration={1200}
            />
          </RadarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Bar Chart */}
      <motion.div
        className="coc-card h-80"
        variants={fadeIn}
        initial="hidden"
        animate="show"
      >
        <h2 className="text-xl font-bold mb-4 text-center text-indigo-400 drop-shadow">
          🌟 Stars & % Destruction
        </h2>
        <ResponsiveContainer>
          <BarChart data={barData} barGap={8}>
            {/* X Axis */}
            <XAxis
              dataKey="name"
              tick={{ fill: "#ccc", fontSize: 12, fontWeight: 500 }}
            />

            {/* Left Y Axis (Stars 0–3) */}
            <YAxis
              yAxisId="left"
              orientation="left"
              stroke="#22c55e"
              domain={[0, 3]}
            />

            {/* Right Y Axis (% Destruction 0–100) */}
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#3b82f6"
              domain={[0, 100]}
            />

            {/* Tooltip */}
            <Tooltip
              contentStyle={{
                background: "#1f2937",
                border: "1px solid #374151",
                borderRadius: "8px",
                color: "#fff",
                fontSize: "12px",
              }}
            />

            {/* Legend */}
            <Legend
              wrapperStyle={{
                paddingTop: "10px",
              }}
            />

            {/* Bars */}
            <Bar
              yAxisId="left"
              dataKey="stars"
              fill="#22c55e"
              name="Stars"
              radius={[6, 6, 0, 0]}
            />
            <Bar
              yAxisId="right"
              dataKey="destruction"
              fill="#3b82f6"
              name="% Destruction"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Point Chart: Stars Distribution */}
      <motion.div
        className="coc-card h-96" // increased height for better spacing
        variants={fadeIn}
        initial="hidden"
        animate="show"
      >
        <h2 className="text-2xl font-extrabold mb-6 text-center text-blue-400 drop-shadow-lg">
          🌟 Stars Distribution
        </h2>

        <ResponsiveContainer>
          <ScatterChart margin={{ top: 30, right: 30, bottom: 30, left: 30 }}>
            {/* Grid with soft strokes */}
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#374151"
              opacity={0.5}
            />

            {/* X Axis */}
            <XAxis
              type="category"
              dataKey="name"
              tick={{ fill: "#ddd", fontSize: 12 }}
              label={{
                value: "Star Type",
                position: "insideBottom",
                offset: -10,
                fill: "#9ca3af",
                fontSize: 13,
              }}
            />

            {/* Y Axis */}
            <YAxis
              type="number"
              dataKey="value"
              tick={{ fill: "#ddd", fontSize: 12 }}
              label={{
                value: "Count",
                angle: -90,
                position: "insideLeft",
                fill: "#9ca3af",
                fontSize: 13,
              }}
            />

            {/* Tooltip with glow effect */}
            <Tooltip
              cursor={{ strokeDasharray: "3 3", stroke: "#60a5fa" }}
              formatter={(val, name) => [`${val}`, "⭐ Stars"]}
              contentStyle={{
                background: "#1f2937",
                border: "1px solid #3b82f6",
                borderRadius: "10px",
                color: "#fff",
                fontSize: "13px",
                boxShadow: "0 0 10px rgba(59,130,246,0.5)",
              }}
            />

            {/* Legend styled */}
            <Legend
              wrapperStyle={{ fontSize: "13px", color: "#e5e7eb" }}
              iconType="circle"
            />

            {/* Scatter Points */}
            <Scatter name="Stars" data={pieData}>
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  stroke="#1f2937"
                  strokeWidth={1.5}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </motion.div>

      {/* War Performance Card */}
      <motion.div
        className="coc-card"
        variants={fadeIn}
        initial="hidden"
        animate="show"
      >
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          📋 War Performance
        </h2>

        <div className="grid grid-cols-2 gap-4 text-center">
          {/* Clan Side */}
          <div className="p-4 rounded-2xl bg-gradient-to-b from-green-700 to-gray-900 text-white shadow-lg border border-green-500">
            <h3 className="font-extrabold text-green-300 text-lg mb-4">
              {clan.name}
            </h3>

            {/* Attacks */}
            <p className="flex justify-between text-sm mb-1">
              <span>⚔️ Attacks</span>
              <span className="font-semibold">{clan.attacks}</span>
            </p>
            <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
              <div
                className="bg-green-400 h-2 rounded-full"
                style={{
                  width: `${Math.min(
                    (clan.attacks / opponent.attacks) * 100,
                    100
                  )}%`,
                }}
              ></div>
            </div>

            {/* Destruction */}
            <p className="flex justify-between text-sm mb-1">
              <span>💥 Destruction</span>
              <span className="font-semibold">
                {clan.destructionPercentage}%
              </span>
            </p>
            <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
              <div
                className="bg-yellow-400 h-2 rounded-full"
                style={{ width: `${clan.destructionPercentage}%` }}
              ></div>
            </div>

            {/* XP */}
            <p className="flex justify-between text-sm">
              <span>⭐ XP Earned</span>
              <span className="font-semibold text-yellow-300">
                {currentWar.state === "warEnded"
                  ? clan.expEarned
                  : "⏳ Pending..."}
              </span>
            </p>
          </div>

          {/* Opponent Side */}
          <div className="p-4 rounded-2xl bg-gradient-to-b from-red-700 to-gray-900 text-white shadow-lg border border-red-500">
            <h3 className="font-extrabold text-red-300 text-lg mb-4">
              {opponent.name}
            </h3>

            {/* Attacks */}
            <p className="flex justify-between text-sm mb-1">
              <span>⚔️ Attacks</span>
              <span className="font-semibold">{opponent.attacks}</span>
            </p>
            <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
              <div
                className="bg-red-400 h-2 rounded-full"
                style={{
                  width: `${Math.min(
                    (opponent.attacks / clan.attacks) * 100,
                    100
                  )}%`,
                }}
              ></div>
            </div>

            {/* Destruction */}
            <p className="flex justify-between text-sm mb-1">
              <span>💥 Destruction</span>
              <span className="font-semibold">
                {opponent.destructionPercentage}%
              </span>
            </p>
            <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
              <div
                className="bg-yellow-400 h-2 rounded-full"
                style={{ width: `${opponent.destructionPercentage}%` }}
              ></div>
            </div>

            {/* XP */}
            <p className="flex justify-between text-sm">
              <span>⭐ XP Earned</span>
              <span className="font-semibold text-yellow-300">
                {currentWar.state === "warEnded"
                  ? opponent.expEarned
                  : "⏳ Pending..."}
              </span>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Top Attackers */}
      <motion.div
        className="coc-card"
        variants={fadeIn}
        initial="hidden"
        animate="show"
      >
        <h2 className="text-xl font-bold mb-4">💥 Top Attackers</h2>
        <ul className="space-y-3">
          {topAttackers.map((p, i) => {
            const efficiency = (p.stars / (p.attacks * 3)) * 100; // % of max stars
            const isMVP = i === 0; // #1 player
            return (
              <li
                key={i}
                className={`p-3 rounded-xl bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-lg border ${
                  isMVP ? "border-yellow-400" : "border-gray-700"
                }`}
              >
                {/* Name + Rank */}
                <div className="flex justify-between items-center mb-1">
                  <span className="truncate max-w-[60%] font-semibold flex items-center gap-2">
                    #{i + 1} {p.name}{" "}
                    {isMVP && (
                      <span className="text-yellow-400 text-lg">🏆</span>
                    )}
                  </span>
                  <span className="text-green-300 font-bold">
                    {p.stars}⭐ ({p.attacks} atk)
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <motion.div
                    className={`h-2 rounded-full ${
                      isMVP ? "bg-yellow-400" : "bg-green-400"
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${efficiency}%` }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                  />
                </div>

                {/* Efficiency text */}
                <p
                  className={`text-xs mt-1 ${
                    isMVP ? "text-yellow-300" : "text-gray-400"
                  }`}
                >
                  🎯 Efficiency: {efficiency.toFixed(1)}%
                </p>
              </li>
            );
          })}
        </ul>
      </motion.div>

      {/* Top Defenders */}
      <motion.div
        className="coc-card"
        variants={fadeIn}
        initial="hidden"
        animate="show"
      >
        <h2 className="text-xl font-bold mb-4">🛡️ Top Defenders</h2>
        <ul className="space-y-3">
          {topDefenders.map((p, i) => {
            const avgStarsLost = p.starsLost / (p.defenses || 1); // average stars lost per defense
            const defenseStrength = Math.max(0, 100 - avgStarsLost * 33); // % (0–100), lower stars lost = stronger defense
            const medals = ["🥇", "🥈", "🥉"];
            const isMVP = i === 0;

            return (
              <li
                key={i}
                className={`p-3 rounded-xl bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-lg border ${
                  isMVP ? "border-blue-400" : "border-gray-700"
                }`}
              >
                {/* Name + Rank */}
                <div className="flex justify-between items-center mb-1">
                  <span className="truncate max-w-[60%] font-semibold flex items-center gap-2">
                    #{i + 1} {p.name}{" "}
                    {i < 3 && <span className="text-lg">{medals[i]}</span>}
                  </span>
                  <span className="text-red-300 font-bold">
                    {p.starsLost}⭐ lost ({p.defenses} def)
                  </span>
                </div>

                {/* Progress bar (defense strength) */}
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <motion.div
                    className={`h-2 rounded-full ${
                      isMVP ? "bg-blue-400" : "bg-red-400"
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${defenseStrength}%` }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                  />
                </div>

                {/* Defense strength */}
                <p
                  className={`text-xs mt-1 ${
                    isMVP ? "text-blue-300" : "text-gray-400"
                  }`}
                >
                  🛡️ Defense Strength: {defenseStrength.toFixed(1)}%
                </p>
              </li>
            );
          })}
        </ul>
      </motion.div>
    </div>
  );
}
