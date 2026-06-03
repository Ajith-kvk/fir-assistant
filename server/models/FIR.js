const mongoose = require("mongoose");

const firSchema = new mongoose.Schema({
  user:              { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  complainantName:   { type: String, required: true },
  complainantPhone:  { type: String, required: true },
  complainantAddress:{ type: String, required: true },
  incidentDate:      { type: String, required: true },
  incidentTime:      { type: String, required: true },
  incidentLocation:  { type: String, required: true },
  incidentDescription:{ type: String, required: true },
  crimeType:         { type: String, default: "" },
  ipcSections:       [{ type: String }],
  firDraft:          { type: String, default: "" },
  evidenceChecklist: [{ type: String }],
  status: {
    type: String,
    enum: ["Draft", "Filed", "Under Investigation", "Resolved"],
    default: "Draft"
  },
  statusHistory: [{
    status:    { type: String },
    note:      { type: String },
    updatedAt: { type: Date, default: Date.now }
  }],
}, { timestamps: true });

module.exports = mongoose.model("FIR", firSchema);