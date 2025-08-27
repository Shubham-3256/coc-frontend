import { useState, useEffect } from "react";
import { API_BASE } from "../config";
import Confetti from "react-confetti";

export default function JoinClanPage() {
  const [formData, setFormData] = useState({
    name: "",
    playerTag: "",
    townHall: "",
    role: "",
    contact: "",
    message: "",
  });
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const WEBHOOK_URL =
    "https://discord.com/api/webhooks/1410186176622628867/85oO_eABulq0NO2tnKKeLSr5N8_9wfTyP_HK5iPPsWm1z4FwnR5MLQ6yCDhbnkj4z_Wd";

  useEffect(() => {
    const handleResize = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (showModal) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [showModal]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validatePlayerTag = async () => {
    const cleanTag = formData.playerTag.replace("#", "").toUpperCase();
    try {
      const res = await fetch(`${API_BASE}/player/${cleanTag}`);
      if (!res.ok) return null;
      return await res.json();
    } catch (err) {
      console.error("Validation error:", err);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Validating...");
    setLoading(true);
    setShowConfetti(false);

    const playerData = await validatePlayerTag();
    if (!playerData || playerData.reason === "notFound") {
      setStatus("❌ Invalid Player Tag. Please check and try again.");
      setLoading(false);
      return;
    }

    setStatus("Sending...");

    try {
      const payload = {
        content: "<@&1410189976284561523> New application received!",
        embeds: [
          {
            title: "⚔️ New Clan Application",
            color: 0x3498db,
            thumbnail: {
              url: playerData.league?.iconUrls?.medium || null,
            },
            fields: [
              { name: "👤 Name", value: formData.name, inline: true },
              {
                name: "🏷️ Player Tag",
                value: formData.playerTag,
                inline: true,
              },
              {
                name: "🏰 TownHall Level",
                value: formData.townHall,
                inline: true,
              },
              {
                name: "🎭 Preferred Role",
                value: formData.role || "N/A",
                inline: true,
              },
              {
                name: "📧 Contact",
                value: formData.contact || "N/A",
                inline: true,
              },
              {
                name: "💬 Message",
                value: formData.message || "N/A",
                inline: false,
              },
              {
                name: "✅ Verified Player",
                value: `${playerData.name} (Lv. ${playerData.expLevel})`,
                inline: false,
              },
              {
                name: "🏆 Trophies",
                value: `${playerData.trophies} (${playerData.bestTrophies} best)`,
                inline: true,
              },
              {
                name: "🛡️ League",
                value: playerData.league?.name || "Unranked",
                inline: true,
              },
              {
                name: "👑 Heroes",
                value: playerData.heroes?.length
                  ? playerData.heroes
                      .map((h) => `${h.name} ⭐ Lv.${h.level}`)
                      .join("\n")
                  : "None",
                inline: false,
              },
              {
                name: "🏘️ Current Clan",
                value: playerData.clan?.name
                  ? `${playerData.clan.name} (${playerData.clan.tag})`
                  : "None",
                inline: false,
              },
            ],
            footer: {
              text: "Clan Application System • Powered by CoC Dashboard",
            },
            timestamp: new Date().toISOString(),
          },
        ],
      };

      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok)
        throw new Error(`Discord webhook failed: ${response.status}`);

      setStatus("✅ Application sent successfully!");
      setShowConfetti(true);
      setShowModal(true);

      setTimeout(() => setShowConfetti(false), 5000);

      setFormData({
        name: "",
        playerTag: "",
        townHall: "",
        role: "",
        contact: "",
        message: "",
      });
    } catch (error) {
      console.error(error);
      setStatus("❌ Failed to send. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#1e293b] p-4 sm:p-6 rounded-2xl shadow-lg max-w-xl w-[95%] sm:w-full mx-auto relative">
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <Confetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={250}
          />
        </div>
      )}

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white text-gray-900 rounded-xl p-6 w-full max-w-md shadow-lg text-center">
            <h3 className="text-xl font-bold mb-2">
              🎉 Application Submitted!
            </h3>
            <p className="text-sm sm:text-base">
              Thanks for applying. Our leaders will review your request soon.
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg w-full sm:w-auto"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-white">
        📋 Join Our Clan
      </h2>
      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-3 sm:px-4 py-2 rounded-lg bg-gray-800 text-white text-sm sm:text-base focus:ring focus:ring-blue-500"
        />

        <input
          type="text"
          name="playerTag"
          placeholder="Player Tag (#XXXXXX)"
          value={formData.playerTag}
          onChange={handleChange}
          required
          className="w-full px-3 sm:px-4 py-2 rounded-lg bg-gray-800 text-white text-sm sm:text-base focus:ring focus:ring-blue-500"
        />

        <select
          name="townHall"
          value={formData.townHall}
          onChange={handleChange}
          required
          className="w-full px-3 sm:px-4 py-2 rounded-lg bg-gray-800 text-white text-sm sm:text-base focus:ring focus:ring-blue-500"
        >
          <option value="">Select TownHall Level</option>
          {Array.from({ length: 17 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              TownHall {i + 1}
            </option>
          ))}
        </select>

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full px-3 sm:px-4 py-2 rounded-lg bg-gray-800 text-white text-sm sm:text-base focus:ring focus:ring-blue-500"
        >
          <option value="">Select Preferred Role</option>
          <option value="Farmer 🌾">Farmer 🌾</option>
          <option value="War Attacker ⚔️">War Attacker ⚔️</option>
          <option value="Donator 🎁">Donator 🎁</option>
        </select>

        <input
          type="text"
          name="contact"
          placeholder="Email or Discord Username"
          value={formData.contact}
          onChange={handleChange}
          className="w-full px-3 sm:px-4 py-2 rounded-lg bg-gray-800 text-white text-sm sm:text-base focus:ring focus:ring-blue-500"
        />

        <textarea
          name="message"
          placeholder="Why should we accept you? (optional)"
          value={formData.message}
          onChange={handleChange}
          className="w-full px-3 sm:px-4 py-2 rounded-lg bg-gray-800 text-white text-sm sm:text-base focus:ring focus:ring-blue-500"
        ></textarea>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-lg font-semibold text-white flex items-center justify-center gap-2 text-sm sm:text-base ${
            loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
              Sending...
            </>
          ) : status === "✅ Application sent successfully!" ? (
            "✅ Sent!"
          ) : (
            "Apply Now"
          )}
        </button>
      </form>

      {status && (
        <p className="mt-3 sm:mt-4 text-center text-xs sm:text-sm">{status}</p>
      )}
    </div>
  );
}
