const FIR = require("../models/FIR");

// Create FIR
exports.createFIR = async (req, res) => {
  try {
    const {
      complainantName,
      complainantPhone,
      complainantAddress,
      incidentDate,
      incidentTime,
      incidentLocation,
      incidentDescription,
      crimeType,
      ipcSections,
      firDraft,
      evidenceChecklist,
    } = req.body;

    const fir = await FIR.create({
      user: req.user._id,
      complainantName,
      complainantPhone,
      complainantAddress,
      incidentDate,
      incidentTime,
      incidentLocation,
      incidentDescription,
      crimeType,
      ipcSections,
      firDraft,
      evidenceChecklist,
      statusHistory: [{ status: "Draft", note: "FIR draft created" }],
    });

    res.status(201).json(fir);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all FIRs for logged in user
exports.getFIRs = async (req, res) => {
  try {
    const firs = await FIR.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(firs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single FIR
exports.getFIR = async (req, res) => {
  try {
    const fir = await FIR.findOne({ _id: req.params.id, user: req.user._id });
    if (!fir) return res.status(404).json({ message: "FIR not found" });
    res.json(fir);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update FIR
exports.updateFIR = async (req, res) => {
  try {
    const fir = await FIR.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    if (!fir) return res.status(404).json({ message: "FIR not found" });
    res.json(fir);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete FIR
exports.deleteFIR = async (req, res) => {
  try {
    const fir = await FIR.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!fir) return res.status(404).json({ message: "FIR not found" });
    res.json({ message: "FIR deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update FIR Status
exports.updateStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    const fir = await FIR.findOne({ _id: req.params.id, user: req.user._id });
    if (!fir) return res.status(404).json({ message: "FIR not found" });

    fir.status = status;
    fir.statusHistory.push({ status, note });
    await fir.save();

    res.json(fir);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};