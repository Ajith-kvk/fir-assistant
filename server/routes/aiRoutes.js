const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  generateFIR,
  detectCrimeType,
  explainIPC,
  getRights
} = require("../controllers/aiController");



router.post("/rights", protect, getRights);
router.post("/generate-fir", protect, generateFIR);
router.post("/detect-crime", protect, detectCrimeType);
router.post("/explain-ipc", protect, explainIPC);

module.exports = router;