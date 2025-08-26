// src/pages/ClanMembersPage.jsx
import { useState, useEffect, useMemo } from "react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  RadialBarChart,
  RadialBar,
} from "recharts";
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

export default function ClanMembersPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterLeague, setFilterLeague] = useState("All");
  const [selectedMember, setSelectedMember] = useState(null);
  const [memberDetails, setMemberDetails] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  // ✅ Fetch clan members
  useEffect(() => {
    async function fetchMembers() {
      try {
        const res = await fetch(`${API_BASE}/clan/${CLAN_TAG}/members`);
        const data = (await res.json()).items || [];

        // Mock sparkline
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

  // ✅ Fetch player details
  useEffect(() => {
    if (!selectedMember) return;

    async function fetchMemberDetails() {
      setModalLoading(true);
      try {
        const tag = selectedMember.tag.replace("#", "");
        const res = await fetch(`${API_BASE}/player/${tag}`);
        const data = await res.json();

        // Mock missing trophy history
        data.trophyHistory = Array.from({ length: 7 }).map((_, i) => ({
          day: i + 1,
          trophies: data.trophies - Math.floor(Math.random() * 50),
        }));

        setMemberDetails(data);
      } catch (err) {
        console.error("Failed to fetch member details:", err);
        setMemberDetails(null);
      } finally {
        setModalLoading(false);
      }
    }
    fetchMemberDetails();
  }, [selectedMember]);

  const displayedMembers = useMemo(() => {
    return members.filter((m) => {
      const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase());
      const matchesLeague =
        filterLeague === "All" || m.league?.name === filterLeague;
      return matchesSearch && matchesLeague;
    });
  }, [members, search, filterLeague]);

  const leagueOptions = [
    "All",
    ...new Set(members.map((m) => m.league?.name).filter(Boolean)),
  ];

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
        🏅 Clan Members & Stats
      </h1>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-3">
        <input
          type="text"
          placeholder="Search member..."
          className="coc-input w-full sm:w-1/2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
          bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="coc-select w-full sm:w-1/3 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
          bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          value={filterLeague}
          onChange={(e) => setFilterLeague(e.target.value)}
        >
          {leagueOptions.map((league) => (
            <option key={league} value={league}>
              {league}
            </option>
          ))}
        </select>
      </div>

      {/* Member Cards */}
      {displayedMembers.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center mt-10">
          No members match your search/filter.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {displayedMembers.map((m) => {
            const tierColor = TIER_COLOR[m.league?.name] || "#888";
            return (
              <div
                key={m.tag}
                className="rounded-lg bg-white dark:bg-gray-800 p-4 shadow-lg hover:shadow-2xl cursor-pointer"
                style={{ borderLeft: `4px solid ${tierColor}` }}
                onClick={() => setSelectedMember(m)}
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-lg truncate">{m.name}</h3>
                  {m.league?.iconUrls?.medium && (
                    <img
                      src={m.league.iconUrls.medium}
                      alt={m.league.name}
                      className="w-10 h-10"
                    />
                  )}
                </div>
                <p className="text-sm">Rank: {m.clanRank}</p>
                <p className="text-sm">Trophies: {m.trophies}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Player Modal */}
      {selectedMember && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl w-full max-w-5xl relative overflow-y-auto max-h-[95vh] shadow-2xl">
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-gray-600 dark:text-gray-300 text-2xl font-bold hover:text-red-500 transition"
              onClick={() => {
                setSelectedMember(null);
                setMemberDetails(null);
              }}
            >
              ✕
            </button>

            {modalLoading ? (
              <p className="text-center text-gray-500 animate-pulse">
                Loading...
              </p>
            ) : memberDetails ? (
              <>
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
                  {memberDetails.league?.iconUrls?.medium && (
                    <img
                      src={memberDetails.league.iconUrls.medium}
                      alt={memberDetails.league.name}
                      className="w-20 h-20 drop-shadow-lg"
                    />
                  )}
                  <div className="text-center sm:text-left">
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                      {memberDetails.name}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                      {memberDetails.tag} | TH {memberDetails.townHallLevel} |
                      XP {memberDetails.expLevel}
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                  <Stat label="Trophies" value={memberDetails.trophies} />
                  <Stat
                    label="Best Trophies"
                    value={memberDetails.bestTrophies}
                  />
                  <Stat label="War Stars" value={memberDetails.warStars} />
                  {memberDetails.versusTrophies && (
                    <Stat
                      label="Versus Trophies"
                      value={memberDetails.versusTrophies}
                    />
                  )}
                  {memberDetails.builderHallLevel && (
                    <Stat
                      label="BH Level"
                      value={memberDetails.builderHallLevel}
                    />
                  )}
                  <Stat label="Donations" value={memberDetails.donations} />
                  <Stat
                    label="Received"
                    value={memberDetails.donationsReceived}
                  />
                  <Stat
                    label="Attack Wins"
                    value={memberDetails.attackWins ?? 0}
                  />
                  <Stat
                    label="Defense Wins"
                    value={memberDetails.defenseWins ?? 0}
                  />
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                  {/* Trophy Trend */}
                  <ChartCard title="📈 Trophy Trend">
                    <LineChart data={memberDetails.trophyHistory}>
                      <Line
                        type="monotone"
                        dataKey="trophies"
                        stroke="url(#trophyGradient)"
                        strokeWidth={3}
                        dot={{ r: 3 }}
                        activeDot={{ r: 6 }}
                      />
                      <defs>
                        <linearGradient
                          id="trophyGradient"
                          x1="0"
                          y1="0"
                          x2="1"
                          y2="0"
                        >
                          <stop offset="0%" stopColor="#22c55e" />
                          <stop offset="100%" stopColor="#f59e0b" />
                        </linearGradient>
                      </defs>
                      <Tooltip />
                    </LineChart>
                  </ChartCard>

                  {/* Donations vs Received (Dual Arc Gauge) */}
                  <DonationsChart memberDetails={memberDetails} />

                  {/* Attack vs Defense (Dual Arc Gauge) */}
                  <AttackDefenseChart memberDetails={memberDetails} />
                </div>

                {/* Achievements */}
                {memberDetails.achievements?.length > 0 && (
                  <div className="mt-6">
                    <h3 className="coc-subtitle mb-4 text-lg sm:text-xl font-bold">
                      🏅 Achievements
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {memberDetails.achievements.slice(0, 9).map((a) => (
                        <div
                          key={a.name}
                          className="p-4 rounded-lg bg-gray-100 dark:bg-gray-700 shadow-md hover:scale-105 transform transition"
                        >
                          <p className="font-semibold">{a.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {a.info}
                          </p>
                          <p className="text-xs text-gray-500">
                            ⭐ {a.stars} | {a.value}/{a.target}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className="text-red-500">Failed to load member details.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* Reusable components */
function Stat({ label, value }) {
  return (
    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-center">
      <p className="text-lg font-bold">{value ?? "N/A"}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="coc-card h-72">
      <h3 className="coc-subtitle">{title}</h3>
      <ResponsiveContainer>{children}</ResponsiveContainer>
    </div>
  );
}

/* Donations Dual Arc Gauge */
function DonationsChart({ memberDetails }) {
  const d = memberDetails.donations || 0;
  const r = memberDetails.donationsReceived || 0;
  const total = d + r;

  return (
    <ChartCard title="📤 Donations vs Received">
      <div className="h-full flex flex-col">
        <div className="flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="40%"
              outerRadius="90%"
              barSize={18}
              startAngle={90}
              endAngle={-270}
              data={[
                { name: "Donations", value: d, fill: "url(#donationGradient)" },
                { name: "Received", value: r, fill: "url(#receivedGradient)" },
              ]}
            >
              <defs>
                <linearGradient
                  id="donationGradient"
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#22c55e" />
                  <stop offset="100%" stopColor="#16a34a" />
                </linearGradient>
                <linearGradient
                  id="receivedGradient"
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#1d4ed8" />
                </linearGradient>
              </defs>

              <RadialBar
                dataKey="value"
                cornerRadius={10}
                background
                clockWise
                animationDuration={1200}
              />
              <Tooltip />

              {/* Center Text */}
              <text
                x="50%"
                y="45%"
                textAnchor="middle"
                className="fill-gray-800 dark:fill-gray-200 text-xl font-bold"
              >
                {total === 0 ? "0%" : `${Math.round((d / total) * 100)}%`}
              </text>
              <text
                x="50%"
                y="60%"
                textAnchor="middle"
                className="fill-gray-500 dark:fill-gray-400 text-sm"
              >
                {`${d} / ${r}`}
              </text>
            </RadialBarChart>
          </ResponsiveContainer>
        </div>

        {/* ✅ Legend inside card */}
        <div className="mt-2 flex justify-center gap-6 text-sm">
          <span className="text-green-500 font-semibold">
            🟢 {total === 0 ? 0 : Math.round((d / total) * 100)}% Donated
          </span>
          <span className="text-blue-500 font-semibold">
            🔵 {total === 0 ? 0 : Math.round((r / total) * 100)}% Received
          </span>
        </div>
      </div>
    </ChartCard>
  );
}

/* Attack vs Defense Dual Arc Gauge */
function AttackDefenseChart({ memberDetails }) {
  const a = memberDetails.attackWins || 0;
  const d = memberDetails.defenseWins || 0;
  const total = a + d;

  return (
    <ChartCard title="⚔️ Attack vs Defense">
      <div className="h-full flex flex-col">
        <div className="flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="40%"
              outerRadius="90%"
              barSize={18}
              startAngle={90}
              endAngle={-270}
              data={[
                { name: "Attack Wins", value: a, fill: "url(#attackGradient)" },
                {
                  name: "Defense Wins",
                  value: d,
                  fill: "url(#defenseGradient)",
                },
              ]}
            >
              <defs>
                <linearGradient id="attackGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
                <linearGradient
                  id="defenseGradient"
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#b91c1c" />
                </linearGradient>
              </defs>

              <RadialBar
                dataKey="value"
                cornerRadius={10}
                background
                clockWise
                animationDuration={1200}
              />
              <Tooltip />

              {/* Center Text */}
              <text
                x="50%"
                y="45%"
                textAnchor="middle"
                className="fill-gray-800 dark:fill-gray-200 text-xl font-bold"
              >
                {total === 0 ? "0%" : `${Math.round((a / total) * 100)}%`}
              </text>
              <text
                x="50%"
                y="60%"
                textAnchor="middle"
                className="fill-gray-500 dark:fill-gray-400 text-sm"
              >
                {`${a} / ${d}`}
              </text>
            </RadialBarChart>
          </ResponsiveContainer>
        </div>

        {/* ✅ Legend inside card */}
        <div className="mt-2 flex justify-center gap-6 text-sm">
          <span className="text-yellow-500 font-semibold">
            ⚔️ {total === 0 ? 0 : Math.round((a / total) * 100)}% Attacks
          </span>
          <span className="text-red-500 font-semibold">
            🛡️ {total === 0 ? 0 : Math.round((d / total) * 100)}% Defenses
          </span>
        </div>
      </div>
    </ChartCard>
  );
}
