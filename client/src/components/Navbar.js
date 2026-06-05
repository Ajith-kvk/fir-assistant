import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import NotificationBell from "./NotificationBell";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/dashboard") return "Dashboard";
    if (path === "/fir/new") return "New FIR";
    if (path === "/fir/history") return "My FIRs";
    if (path.startsWith("/fir/")) return "FIR Details";
    if (path === "/rights") return "Know Your Rights";
    if (path === "/police-finder") return "Police Station Finder";
    return "FIR Assistant";
  };

  return (
    <nav className="px-6 py-3 flex items-center justify-between border-b sticky top-0 z-50"
      style={{ backgroundColor: "#1e293b", borderColor: "#334155" }}>

      {/* Left */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/dashboard")}>
          <span className="text-2xl">⚖️</span>
          <span className="text-white text-lg font-bold hidden sm:block">FIR Assistant</span>
        </div>
        <div className="hidden md:block w-px h-5 bg-slate-600" />
        <span className="hidden md:block text-slate-400 text-sm">{getPageTitle()}</span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <NotificationBell />
        <button
          onClick={() => navigate("/fir/new")}
          className="hidden sm:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-xl transition"
        >
          + New FIR
        </button>
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer hover:bg-slate-700 transition"
          onClick={() => navigate("/dashboard")}>
          <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <span className="text-slate-300 text-sm hidden sm:block">{user?.name?.split(" ")[0]}</span>
        </div>
        <button
          onClick={handleLogout}
          className="text-slate-400 hover:text-red-400 text-sm transition px-2 py-1 rounded-lg hover:bg-red-400 hover:bg-opacity-10"
        >
          Sign out
        </button>
      </div>
    </nav>
  );
};

export default Navbar;