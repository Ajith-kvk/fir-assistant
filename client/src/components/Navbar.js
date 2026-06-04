import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <nav className="px-6 py-4 flex items-center justify-between border-b"
      style={{ backgroundColor: "#1e293b", borderColor: "#334155" }}>
      <div className="flex items-center gap-2">
        <span className="text-2xl">⚖️</span>
        <span className="text-white text-lg font-bold">FIR Assistant</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <span className="text-slate-300 text-sm hidden sm:block">{user?.name}</span>
        <button
          onClick={handleLogout}
          className="text-slate-400 hover:text-red-400 text-sm transition"
        >
          Sign out
        </button>
      </div>
    </nav>
  );
};

export default Navbar;