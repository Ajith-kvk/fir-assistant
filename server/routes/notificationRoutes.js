const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getNotifications,
  markRead,
  markAllRead,
  deleteNotification,
} = require("../controllers/notificationController");

router.get("/", protect, getNotifications);
router.put("/:id/read", protect, markRead);
router.put("/mark-all-read", protect, markAllRead);
router.delete("/:id", protect, deleteNotification);

module.exports = router;