import { NavLink } from "react-router-dom";

const links = [
  { path: "/dashboard", label: "Dashboard", icon: "📊" },
  { path: "/fir/new", label: "New FIR", icon: "📝" },
  { path: "/fir/history", label: "My FIRs", icon: "📁" },
  { path: "/rights", label: "Know Your Rights", icon: "⚖️" },
  { path: "/police-finder", label: "Police Stations", icon: "🚔" },
];

const Sidebar = () => {
  return (
    <div className="w-64 min-h-screen p-4 flex flex-col gap-1 border-r"
      style={{ backgroundColor: "#1e293b", borderColor: "#334155" }}>
      <p className="text-slate-500 text-xs uppercase font-semibold mb-3 px-3">
        Menu
      </p>
      {links.map((link) => (
        <NavLink
          key={link.path}
          to={link.path}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
              isActive
                ? "bg-blue-600 text-white"
                : "text-slate-400 hover:text-white hover:bg-slate-700"
            }`
          }
        >
          <span>{link.icon}</span>
          <span>{link.label}</span>
        </NavLink>
      ))}
    </div>
  );
};

export default Sidebar;