import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const PoliceFinderPage = () => {
  const [city, setCity] = useState("");
  const [searched, setSearched] = useState(false);
  const [mapUrl, setMapUrl] = useState("");

  const handleSearch = () => {
    if (!city.trim()) return;
    const query = encodeURIComponent(`police station in ${city}`);
    setMapUrl(
      `https://www.openstreetmap.org/export/embed.html?bbox=&layer=mapnik&marker=&query=${query}`
    );
    setSearched(true);
  };

  const openGoogleMaps = () => {
    const query = encodeURIComponent(`police station near ${city}`);
    window.open(`https://www.google.com/maps/search/${query}`, "_blank");
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0f172a" }}>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-6 max-w-4xl">

          <h1 className="text-2xl font-bold text-white mb-2">🚔 Police Station Finder</h1>
          <p className="text-slate-400 mb-6">Find nearest police stations in your area</p>

          {/* Search */}
          <div className="flex gap-3 mb-6">
            <input
              type="text"
              placeholder="Enter your city or area (e.g. Bengaluru, Mumbai)"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1 px-4 py-3 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ backgroundColor: "#1e293b" }}
            />
            <button
              onClick={handleSearch}
              disabled={!city.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl transition"
            >
              Search
            </button>
          </div>

          {searched && (
            <div className="flex flex-col gap-4">

              {/* Google Maps Button */}
              <button
                onClick={openGoogleMaps}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white font-medium transition"
                style={{ backgroundColor: "#1e293b" }}
              >
                <span>🗺️</span>
                Open in Google Maps — Police Stations near {city}
              </button>

              {/* Emergency Numbers */}
              <div className="rounded-2xl p-6" style={{ backgroundColor: "#1e293b" }}>
                <h2 className="text-white font-semibold mb-4">📞 Emergency Numbers</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { label: "Police", number: "100", icon: "🚔", color: "bg-blue-600" },
                    { label: "Ambulance", number: "108", icon: "🚑", color: "bg-red-600" },
                    { label: "Women Helpline", number: "1091", icon: "👩", color: "bg-pink-600" },
                    { label: "Child Helpline", number: "1098", icon: "👶", color: "bg-yellow-600" },
                    { label: "Senior Citizen", number: "14567", icon: "👴", color: "bg-green-600" },
                    { label: "Cyber Crime", number: "1930", icon: "💻", color: "bg-purple-600" },
                  ].map((item) => (
                    <div key={item.label}
                      className="p-4 rounded-xl flex items-center gap-3"
                      style={{ backgroundColor: "#0f172a" }}>
                      <div className={`w-10 h-10 ${item.color} rounded-xl flex items-center justify-center text-lg`}>
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-white font-bold text-lg">{item.number}</p>
                        <p className="text-slate-400 text-xs">{item.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips */}
              <div className="rounded-2xl p-6" style={{ backgroundColor: "#1e293b" }}>
                <h2 className="text-white font-semibold mb-4">💡 Tips for Visiting Police Station</h2>
                <div className="flex flex-col gap-2">
                  {[
                    "Always carry a valid photo ID (Aadhar, PAN, Passport)",
                    "Bring two copies of your complaint letter",
                    "Note down the name and badge number of the officer",
                    "Ask for a copy of the FIR after it is registered",
                    "If police refuse to file FIR call 100 or approach magistrate",
                    "You can file FIR at any police station in India",
                  ].map((tip, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl"
                      style={{ backgroundColor: "#0f172a" }}>
                      <span className="text-blue-400 mt-0.5">→</span>
                      <p className="text-slate-300 text-sm">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* Default state */}
          {!searched && (
            <div className="rounded-2xl p-12 flex flex-col items-center gap-4"
              style={{ backgroundColor: "#1e293b" }}>
              <div className="text-6xl">🚔</div>
              <p className="text-white font-medium">Enter your city to find police stations</p>
              <p className="text-slate-400 text-sm text-center">
                We'll help you find the nearest police station and emergency numbers
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default PoliceFinderPage;