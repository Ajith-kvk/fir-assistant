import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [firs, setFIRs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/fir").then((res) => {
      setFIRs(res.data);
      setLoading(false);
    });
  }, []);

  const stats = [
    { label: "Total FIRs", value: firs.length, icon: "📁", color: "bg-blue-600" },
    { label: "Drafts", value: firs.filter(f => f.status === "Draft").length, icon: "📝", color: "bg-yellow-600" },
    { label: "Filed", value: firs.filter(f => f.status === "Filed").length, icon: "✅", color: "bg-green-600" },
    { label: "Resolved", value: firs.filter(f => f.status === "Resolved").length, icon: "🏁", color: "bg-purple-600" },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0f172a" }}>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-6">

          {/* Welcome */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">
              Welcome back, {user?.name?.split(" ")[0]} 👋
            </h1>
            <p className="text-slate-400 mt-1">
              Here is your FIR summary
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat) => (
              <div key={stat.label}
                className="p-4 rounded-2xl flex items-center gap-4"
                style={{ backgroundColor: "#1e293b" }}>
                <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-2xl`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-slate-400 text-sm">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Recent FIRs */}
          <div className="rounded-2xl p-6" style={{ backgroundColor: "#1e293b" }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-semibold text-lg">Recent FIRs</h2>
              <button
                onClick={() => navigate("/fir/new")}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-xl transition"
              >
                + New FIR
              </button>
            </div>

            {loading ? (
              <p className="text-slate-400 text-center py-8">Loading...</p>
            ) : firs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-4xl mb-3">📁</p>
                <p className="text-slate-400">No FIRs yet</p>
                <button
                  onClick={() => navigate("/fir/new")}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white text-sm px-6 py-2 rounded-xl transition"
                >
                  Create your first FIR
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {firs.slice(0, 5).map((fir) => (
                  <div
                    key={fir._id}
                    onClick={() => navigate(`/fir/${fir._id}`)}
                    className="flex items-center justify-between p-4 rounded-xl cursor-pointer hover:bg-slate-700 transition"
                    style={{ backgroundColor: "#0f172a" }}
                  >
                    <div>
                      <p className="text-white font-medium">{fir.crimeType || "FIR Draft"}</p>
                      <p className="text-slate-400 text-sm">{fir.incidentLocation} • {new Date(fir.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                      fir.status === "Draft" ? "bg-yellow-600 text-white" :
                      fir.status === "Filed" ? "bg-green-600 text-white" :
                      fir.status === "Under Investigation" ? "bg-blue-600 text-white" :
                      "bg-purple-600 text-white"
                    }`}>
                      {fir.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default DashboardPage;