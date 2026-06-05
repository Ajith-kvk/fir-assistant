import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const links = [
  { path: "/dashboard", label: "Dashboard", icon: "📊" },
  { path: "/fir/new", label: "New FIR", icon: "📝" },
  { path: "/fir/history", label: "My FIRs", icon: "📁" },
  { path: "/legal-chat", label: "Legal Advisor", icon: "🤖" },
  { path: "/rights", label: "Know Your Rights", icon: "⚖️" },
  { path: "/police-finder", label: "Police Stations", icon: "🚔" },
];

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="w-64 min-h-screen p-4 flex flex-col justify-between border-r"
      style={{ backgroundColor: "#1e293b", borderColor: "#334155" }}>

      <div>
        <p className="text-slate-500 text-xs uppercase font-semibold mb-3 px-3 mt-2">
          Navigation
        </p>
        <div className="flex flex-col gap-1">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:text-white hover:bg-slate-700"
                }`
              }
            >
              <span className="text-lg">{link.icon}</span>
              <span>{link.label}</span>
            </NavLink>
          ))}
        </div>
      </div>

      {/* User Profile at Bottom */}
      <div className="border-t pt-4" style={{ borderColor: "#334155" }}>
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl mb-2"
          style={{ backgroundColor: "#0f172a" }}>
          <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">{user?.name}</p>
            <p className="text-slate-500 text-xs truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full text-left px-3 py-2 text-slate-400 hover:text-red-400 text-sm rounded-xl hover:bg-red-400 hover:bg-opacity-10 transition flex items-center gap-2"
        >
          <span>🚪</span>
          <span>Sign out</span>
        </button>
      </div>

    </div>
  );
};

export default Sidebar;