import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "", email: "", phone: "", password: "", address: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      toast.success("Account created successfully!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6"
      style={{ backgroundColor: "#0f172a" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">⚖️</div>
          <h1 className="text-3xl font-bold text-white">FIR Assistant</h1>
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
        <p className="text-slate-400 mb-6">Join FIR Assistant today</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {[
            { name: "name", label: "Full Name", type: "text", placeholder: "John Doe" },
            { name: "email", label: "Email", type: "email", placeholder: "you@example.com" },
            { name: "phone", label: "Phone Number", type: "tel", placeholder: "9876543210" },
            { name: "password", label: "Password", type: "password", placeholder: "••••••••" },
            { name: "address", label: "Address", type: "text", placeholder: "Your full address" },
          ].map((field) => (
            <div key={field.name}>
              <label className="text-slate-400 text-sm mb-1 block">{field.label}</label>
              <input
                type={field.type} name={field.name}
                placeholder={field.placeholder}
                value={form[field.name]} onChange={handleChange}
                required={field.name !== "address"}
                className="w-full px-4 py-3 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ backgroundColor: "#1e293b" }}
              />
            </div>
          ))}
          <button
            type="submit" disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-xl transition mt-2"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="text-slate-500 text-center mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;