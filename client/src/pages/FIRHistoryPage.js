import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import toast from "react-hot-toast";

const FIRHistoryPage = () => {
  const navigate = useNavigate();
  const [firs, setFIRs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.get("/fir").then((res) => {
      setFIRs(res.data);
      setLoading(false);
    });
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this FIR?")) return;
    try {
      await api.delete(`/fir/${id}`);
      setFIRs(firs.filter((f) => f._id !== id));
      toast.success("FIR deleted");
    } catch (err) {
      toast.error("Failed to delete FIR");
    }
  };

  const filtered = firs.filter((f) =>
    f.crimeType?.toLowerCase().includes(search.toLowerCase()) ||
    f.incidentLocation?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0f172a" }}>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-6">

          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white">📁 My FIRs</h1>
              <p className="text-slate-400 mt-1">All your FIR drafts in one place</p>
            </div>
            <button
              onClick={() => navigate("/fir/new")}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-xl transition"
            >
              + New FIR
            </button>
          </div>

          {/* Search */}
          <input
            type="text"
            placeholder="Search by crime type or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
            style={{ backgroundColor: "#1e293b" }}
          />

          {loading ? (
            <p className="text-slate-400 text-center py-12">Loading...</p>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-4xl mb-3">📁</p>
              <p className="text-slate-400">No FIRs found</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filtered.map((fir) => (
                <div
                  key={fir._id}
                  className="p-5 rounded-2xl flex items-center justify-between"
                  style={{ backgroundColor: "#1e293b" }}
                >
                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() => navigate(`/fir/${fir._id}`)}
                  >
                    <div className="flex items-center gap-3 mb-1">
                      <p className="text-white font-semibold">
                        {fir.crimeType || "FIR Draft"}
                      </p>
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                        fir.status === "Draft" ? "bg-yellow-600 text-white" :
                        fir.status === "Filed" ? "bg-green-600 text-white" :
                        fir.status === "Under Investigation" ? "bg-blue-600 text-white" :
                        "bg-purple-600 text-white"
                      }`}>
                        {fir.status}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm">
                      📍 {fir.incidentLocation} • 📅 {new Date(fir.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(fir._id)}
                    className="text-slate-600 hover:text-red-400 transition ml-4 text-lg"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default FIRHistoryPage;