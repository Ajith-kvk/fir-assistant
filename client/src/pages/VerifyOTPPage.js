import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import api from "../utils/api";
import toast from "react-hot-toast";

const VerifyOTPPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/verify-otp", { email, otp });
      toast.success("OTP verified!");
      navigate("/reset-password", { state: { email, otp } });
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6"
      style={{ backgroundColor: "#0f172a" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">📧</div>
          <h2 className="text-2xl font-bold text-white">Verify OTP</h2>
          <p className="text-slate-400 mt-2">Enter the 6 digit OTP sent to</p>
          <p className="text-blue-400 font-medium">{email}</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-slate-400 text-sm mb-1 block">Enter OTP</label>
            <input
              type="text" placeholder="Enter 6 digit OTP"
              value={otp} onChange={(e) => setOtp(e.target.value)}
              maxLength={6} required
              className="w-full px-4 py-3 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-2xl tracking-widest"
              style={{ backgroundColor: "#1e293b" }}
            />
          </div>
          <button
            type="submit" disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-xl transition"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <p className="text-slate-500 text-center mt-6">
          Didn't receive OTP?{" "}
          <Link to="/forgot-password" className="text-blue-400 hover:underline">
            Resend
          </Link>
        </p>
      </div>
    </div>
  );
};

export default VerifyOTPPage;