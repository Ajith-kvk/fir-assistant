const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  createFIR,
  getFIRs,
  getFIR,
  updateFIR,
  deleteFIR,
  updateStatus,
} = require("../controllers/firController");

router.post("/", protect, createFIR);
router.get("/", protect, getFIRs);
router.get("/:id", protect, getFIR);
router.put("/:id", protect, updateFIR);
router.delete("/:id", protect, deleteFIR);
router.post("/:id/status", protect, updateStatus);

module.exports = router;