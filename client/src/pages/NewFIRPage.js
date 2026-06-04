import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import toast from "react-hot-toast";

const NewFIRPage = () => {
  const navigate = useNavigate();
  const typingTimeout = useRef(null);

  const [form, setForm] = useState({
    complainantName: "",
    complainantPhone: "",
    complainantAddress: "",
    incidentDate: "",
    incidentTime: "",
    incidentLocation: "",
    incidentDescription: "",
  });

  const [crimeType, setCrimeType] = useState("");
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [step, setStep] = useState(1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Real time crime detection
    if (name === "incidentDescription") {
      clearTimeout(typingTimeout.current);
      typingTimeout.current = setTimeout(async () => {
        if (value.length > 20) {
          try {
            const { data } = await api.post("/ai/detect-crime", { description: value });
            setCrimeType(data.crimeType);
          } catch (err) {}
        }
      }, 1000);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const { data } = await api.post("/ai/generate-fir", form);
      setAiResult(data);
      setCrimeType(data.crimeType);
      setStep(2);
      toast.success("FIR draft generated successfully!");
    } catch (err) {
      toast.error("Failed to generate FIR. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await api.post("/fir", {
        ...form,
        crimeType: aiResult.crimeType,
        ipcSections: aiResult.ipcSections,
        firDraft: aiResult.firDraft,
        evidenceChecklist: aiResult.evidenceChecklist,
      });
      toast.success("FIR saved successfully!");
      navigate(`/fir/${data._id}`);
    } catch (err) {
      toast.error("Failed to save FIR");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0f172a" }}>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-6 max-w-4xl">

          <h1 className="text-2xl font-bold text-white mb-2">📝 New FIR</h1>
          <p className="text-slate-400 mb-6">Fill in the details and let AI generate your FIR draft</p>

          {/* Steps */}
          <div className="flex items-center gap-4 mb-8">
            {["Fill Details", "Review AI Draft"].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step > i + 1 ? "bg-green-600 text-white" :
                  step === i + 1 ? "bg-blue-600 text-white" :
                  "bg-slate-700 text-slate-400"
                }`}>
                  {step > i + 1 ? "✓" : i + 1}
                </div>
                <span className={`text-sm ${step === i + 1 ? "text-white" : "text-slate-400"}`}>{s}</span>
                {i < 1 && <div className="w-12 h-0.5 bg-slate-700" />}
              </div>
            ))}
          </div>

          {step === 1 && (
            <div className="rounded-2xl p-6 flex flex-col gap-5"
              style={{ backgroundColor: "#1e293b" }}>

              {/* Complainant Details */}
              <h2 className="text-white font-semibold text-lg">👤 Complainant Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: "complainantName", label: "Full Name", type: "text", placeholder: "Your full name" },
                  { name: "complainantPhone", label: "Phone Number", type: "tel", placeholder: "9876543210" },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="text-slate-400 text-sm mb-1 block">{field.label}</label>
                    <input
                      type={field.type} name={field.name}
                      placeholder={field.placeholder}
                      value={form[field.name]} onChange={handleChange} required
                      className="w-full px-4 py-3 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{ backgroundColor: "#0f172a" }}
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="text-slate-400 text-sm mb-1 block">Address</label>
                <input
                  type="text" name="complainantAddress"
                  placeholder="Your full address"
                  value={form.complainantAddress} onChange={handleChange} required
                  className="w-full px-4 py-3 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ backgroundColor: "#0f172a" }}
                />
              </div>

              {/* Incident Details */}
              <h2 className="text-white font-semibold text-lg mt-2">📍 Incident Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { name: "incidentDate", label: "Date", type: "date" },
                  { name: "incidentTime", label: "Time", type: "time" },
                  { name: "incidentLocation", label: "Location", type: "text", placeholder: "Where did it happen?" },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="text-slate-400 text-sm mb-1 block">{field.label}</label>
                    <input
                      type={field.type} name={field.name}
                      placeholder={field.placeholder || ""}
                      value={form[field.name]} onChange={handleChange} required
                      className="w-full px-4 py-3 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{ backgroundColor: "#0f172a" }}
                    />
                  </div>
                ))}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-400 text-sm">Describe what happened</label>
                  {crimeType && (
                    <span className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full">
                      🔍 Detected: {crimeType}
                    </span>
                  )}
                </div>
                <textarea
                  name="incidentDescription"
                  placeholder="Describe the incident in your own words. Include what happened, who was involved, and any other details you remember..."
                  value={form.incidentDescription}
                  onChange={handleChange} required
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  style={{ backgroundColor: "#0f172a" }}
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={generating || !form.incidentDescription || !form.complainantName}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-xl transition flex items-center justify-center gap-2"
              >
                {generating ? (
                  <>
                    <span className="animate-spin">⚙️</span>
                    Generating FIR with AI...
                  </>
                ) : (
                  <>🤖 Generate FIR with AI</>
                )}
              </button>

            </div>
          )}

          {step === 2 && aiResult && (
            <div className="flex flex-col gap-6">

              {/* Crime Type */}
              <div className="rounded-2xl p-6" style={{ backgroundColor: "#1e293b" }}>
                <h2 className="text-white font-semibold text-lg mb-3">🔍 Crime Type Detected</h2>
                <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                  {aiResult.crimeType}
                </span>
              </div>

              {/* IPC Sections */}
              <div className="rounded-2xl p-6" style={{ backgroundColor: "#1e293b" }}>
                <h2 className="text-white font-semibold text-lg mb-3">📚 Applicable IPC Sections</h2>
                <div className="flex flex-col gap-3">
                  {aiResult.ipcSections?.map((section, i) => (
                    <div key={i} className="p-4 rounded-xl" style={{ backgroundColor: "#0f172a" }}>
                      <p className="text-blue-400 font-semibold">{section}</p>
                      {aiResult.ipcExplanations?.[section] && (
                        <p className="text-slate-400 text-sm mt-1">
                          {aiResult.ipcExplanations[section]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Evidence Checklist */}
              <div className="rounded-2xl p-6" style={{ backgroundColor: "#1e293b" }}>
                <h2 className="text-white font-semibold text-lg mb-3">✅ Evidence to Collect</h2>
                <div className="flex flex-col gap-2">
                  {aiResult.evidenceChecklist?.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl"
                      style={{ backgroundColor: "#0f172a" }}>
                      <span className="text-green-400">☐</span>
                      <span className="text-slate-300 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* FIR Draft */}
              <div className="rounded-2xl p-6" style={{ backgroundColor: "#1e293b" }}>
                <h2 className="text-white font-semibold text-lg mb-3">📄 FIR Draft</h2>
                <textarea
                  value={aiResult.firDraft}
                  onChange={(e) => setAiResult({ ...aiResult, firDraft: e.target.value })}
                  rows={12}
                  className="w-full px-4 py-3 rounded-xl text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm leading-relaxed"
                  style={{ backgroundColor: "#0f172a" }}
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 text-slate-400 hover:text-white border border-slate-600 rounded-xl transition"
                >
                  ← Edit Details
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold rounded-xl transition"
                >
                  {saving ? "Saving..." : "💾 Save FIR"}
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default NewFIRPage;