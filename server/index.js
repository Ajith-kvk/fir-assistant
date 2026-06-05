const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const firRoutes = require("./routes/firRoutes");
const aiRoutes = require("./routes/aiRoutes");
const chatRoutes = require("./routes/chatRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

dotenv.config();

const app = express();

app.use(cors({
  origin: function(origin, callback) {
    const allowedOrigins = [
      "http://localhost:3000",
      "https://fir-assistant.vercel.app",
      process.env.CLIENT_URL,
    ];
    // Allow requests with no origin (mobile apps, curl, postman)
    if (!origin) return callback(null, true);
    // Remove trailing slash and check
    const cleanOrigin = origin.replace(/\/$/, "");
    if (allowedOrigins.some(o => o?.replace(/\/$/, "") === cleanOrigin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));
app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/fir", firRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/notifications", notificationRoutes);

app.get("/", (req, res) => res.send("FIR Assistant Server Running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));