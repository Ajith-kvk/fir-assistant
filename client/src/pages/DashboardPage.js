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

  const getStatusStyle = (status) => {
    const styles = {
      "Draft": "bg-yellow-500 bg-opacity-20 text-yellow-400",
      "Filed": "bg-green-500 bg-opacity-20 text-green-400",
      "Under Investigation": "bg-blue-500 bg-opacity-20 text-blue-400",
      "Resolved": "bg-purple-500 bg-opacity-20 text-purple-400",
    };
    return styles[status] || "bg-slate-500 bg-opacity-20 text-slate-400";
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0f172a" }}>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-6 page-animate">

          {/* Welcome Banner */}
          <div className="rounded-2xl p-6 mb-6 flex items-center justify-between"
            style={{ background: "linear-gradient(135deg, #1e40af, #3b82f6)" }}>
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">
                Welcome back, {user?.name?.split(" ")[0]}! 👋
              </h1>
              <p className="text-blue-200 text-sm">
                Your legal aid assistant is ready to help
              </p>
            </div>
            <button
              onClick={() => navigate("/fir/new")}
              className="bg-white text-blue-600 font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-50 transition text-sm hidden sm:block"
            >
              + New FIR
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat) => (
              <div key={stat.label}
                className="p-5 rounded-2xl card-hover"
                style={{ backgroundColor: "#1e293b" }}>
                <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-2xl mb-3`}>
                  {stat.icon}
                </div>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-slate-400 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[
              { label: "File a New FIR", desc: "AI generates your FIR draft", icon: "📝", path: "/fir/new", color: "bg-blue-600" },
              { label: "Know Your Rights", desc: "Learn your legal rights", icon: "⚖️", path: "/rights", color: "bg-green-600" },
              { label: "Find Police Station", desc: "Locate nearest station", icon: "🚔", path: "/police-finder", color: "bg-purple-600" },
            ].map((action) => (
              <button
                key={action.label}
                onClick={() => navigate(action.path)}
                className="p-5 rounded-2xl text-left card-hover flex items-center gap-4"
                style={{ backgroundColor: "#1e293b" }}
              >
                <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center text-2xl flex-shrink-0`}>
                  {action.icon}
                </div>
                <div>
                  <p className="text-white font-semibold">{action.label}</p>
                  <p className="text-slate-400 text-sm">{action.desc}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Recent FIRs */}
          <div className="rounded-2xl p-6" style={{ backgroundColor: "#1e293b" }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white font-semibold text-lg">Recent FIRs</h2>
              <button
                onClick={() => navigate("/fir/history")}
                className="text-blue-400 hover:text-blue-300 text-sm transition"
              >
                View all →
              </button>
            </div>

            {loading ? (
              <div className="flex flex-col gap-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 rounded-xl pulse"
                    style={{ backgroundColor: "#0f172a" }} />
                ))}
              </div>
            ) : firs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-5xl mb-3">📁</p>
                <p className="text-white font-medium mb-1">No FIRs yet</p>
                <p className="text-slate-400 text-sm mb-4">
                  Create your first FIR draft with AI assistance
                </p>
                <button
                  onClick={() => navigate("/fir/new")}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-6 py-2.5 rounded-xl transition"
                >
                  Create First FIR
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {firs.slice(0, 5).map((fir) => (
                  <div
                    key={fir._id}
                    onClick={() => navigate(`/fir/${fir._id}`)}
                    className="flex items-center justify-between p-4 rounded-xl cursor-pointer hover:bg-slate-700 transition"
                    style={{ backgroundColor: "#0f172a" }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600 bg-opacity-20 rounded-xl flex items-center justify-center text-lg">
                        📄
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">
                          {fir.crimeType || "FIR Draft"}
                        </p>
                        <p className="text-slate-400 text-xs">
                          📍 {fir.incidentLocation} • {new Date(fir.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusStyle(fir.status)}`}>
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