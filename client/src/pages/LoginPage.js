import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#0f172a" }}>

      {/* Left Panel */}
      <div className="hidden lg:flex w-1/2 flex-col items-center justify-center p-12"
        style={{ backgroundColor: "#1e293b" }}>
        <div className="text-center">
          <div className="text-7xl mb-6">⚖️</div>
          <h1 className="text-4xl font-bold text-white mb-4">FIR Assistant</h1>
          <p className="text-slate-400 text-lg max-w-sm">
            AI powered legal aid for every citizen. Draft FIRs, know your rights and track your case.
          </p>
          <div className="mt-10 flex flex-col gap-3">
            {[
              "AI generated FIR drafts",
              "Automatic IPC section suggestions",
              "Case progress tracker",
              "Know your legal rights",
            ].map((f) => (
              <div key={f} className="flex items-center gap-3 text-slate-400">
                <span className="text-blue-400 text-lg">✓</span>
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            <div className="text-5xl mb-3">⚖️</div>
            <h1 className="text-3xl font-bold text-white">FIR Assistant</h1>
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">Welcome back</h2>
          <p className="text-slate-400 mb-8">Sign in to your account</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-slate-400 text-sm mb-1 block">Email</label>
              <input
                type="email" name="email" placeholder="you@example.com"
                value={form.email} onChange={handleChange} required
                className="w-full px-4 py-3 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ backgroundColor: "#1e293b" }}
              />
            </div>
            <div>
              <label className="text-slate-400 text-sm mb-1 block">Password</label>
              <input
                type="password" name="password" placeholder="••••••••"
                value={form.password} onChange={handleChange} required
                className="w-full px-4 py-3 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ backgroundColor: "#1e293b" }}
              />
            </div>
            <div className="text-right">
              <Link to="/forgot-password" className="text-blue-400 text-sm hover:underline">
                Forgot Password?
              </Link>
            </div>
            <button
              type="submit" disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-xl transition"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-slate-500 text-center mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-400 hover:underline font-medium">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;