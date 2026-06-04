import { useState } from "react";
import api from "../utils/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import toast from "react-hot-toast";

const topics = [
  { label: "Rights when filing FIR", icon: "📝" },
  { label: "Rights during arrest", icon: "🚨" },
  { label: "Rights during police interrogation", icon: "🗣️" },
  { label: "Rights as a victim", icon: "🛡️" },
  { label: "Rights to bail", icon: "⚖️" },
  { label: "Rights during house search", icon: "🏠" },
  { label: "Rights of women in police custody", icon: "👩" },
  { label: "Rights to free legal aid", icon: "📚" },
];

const RightsPage = () => {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [customTopic, setCustomTopic] = useState("");

  const handleSearch = async (topic) => {
    setLoading(true);
    setResult(null);
    setSelectedTopic(topic);
    try {
      const { data } = await api.post("/ai/rights", { topic });
      setResult(data);
    } catch (err) {
      toast.error("Failed to fetch rights info");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0f172a" }}>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-6 max-w-4xl">

          <h1 className="text-2xl font-bold text-white mb-2">⚖️ Know Your Rights</h1>
          <p className="text-slate-400 mb-6">
            Learn your legal rights as an Indian citizen in simple language
          </p>

          {/* Topic Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {topics.map((t) => (
              <button
                key={t.label}
                onClick={() => handleSearch(t.label)}
                className={`p-4 rounded-2xl text-left transition border ${
                  selectedTopic === t.label
                    ? "border-blue-500 bg-blue-600 bg-opacity-20"
                    : "border-transparent hover:border-slate-600"
                }`}
                style={{ backgroundColor: "#1e293b" }}
              >
                <div className="text-2xl mb-2">{t.icon}</div>
                <p className="text-slate-300 text-xs font-medium">{t.label}</p>
              </button>
            ))}
          </div>

          {/* Custom Topic Search */}
          <div className="flex gap-3 mb-8">
            <input
              type="text"
              placeholder="Ask about any legal right..."
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && customTopic && handleSearch(customTopic)}
              className="flex-1 px-4 py-3 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ backgroundColor: "#1e293b" }}
            />
            <button
              onClick={() => customTopic && handleSearch(customTopic)}
              disabled={!customTopic || loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl transition"
            >
              Search
            </button>
          </div>

          {/* Loading */}
          {loading && (
            <div className="rounded-2xl p-12 flex flex-col items-center gap-4"
              style={{ backgroundColor: "#1e293b" }}>
              <div className="text-4xl animate-spin">⚖️</div>
              <p className="text-slate-400">Fetching your legal rights...</p>
            </div>
          )}

          {/* Results */}
          {result && !loading && (
            <div className="flex flex-col gap-4">

              {/* Summary */}
              <div className="rounded-2xl p-6" style={{ backgroundColor: "#1e293b" }}>
                <h2 className="text-white font-bold text-xl mb-2">{result.title}</h2>
                <p className="text-slate-400">{result.summary}</p>
              </div>

              {/* Rights List */}
              <div className="rounded-2xl p-6" style={{ backgroundColor: "#1e293b" }}>
                <h3 className="text-white font-semibold mb-4">Your Rights:</h3>
                <div className="flex flex-col gap-3">
                  {result.rights?.map((right, i) => (
                    <div key={i}
                      className={`p-4 rounded-xl border-l-4 ${
                        right.important
                          ? "border-blue-500"
                          : "border-slate-600"
                      }`}
                      style={{ backgroundColor: "#0f172a" }}>
                      <div className="flex items-center gap-2 mb-1">
                        <span>{right.important ? "🔵" : "⚪"}</span>
                        <p className="text-white font-medium text-sm">{right.title}</p>
                        {right.important && (
                          <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
                            Important
                          </span>
                        )}
                      </div>
                      <p className="text-slate-400 text-sm leading-relaxed pl-6">
                        {right.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips */}
              {result.tips?.length > 0 && (
                <div className="rounded-2xl p-6" style={{ backgroundColor: "#1e293b" }}>
                  <h3 className="text-white font-semibold mb-4">💡 Practical Tips:</h3>
                  <div className="flex flex-col gap-2">
                    {result.tips.map((tip, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-xl"
                        style={{ backgroundColor: "#0f172a" }}>
                        <span className="text-yellow-400 mt-0.5">💡</span>
                        <p className="text-slate-300 text-sm">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default RightsPage;