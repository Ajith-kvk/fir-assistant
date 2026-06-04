const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const firRoutes = require("./routes/firRoutes");
const aiRoutes = require("./routes/aiRoutes");

dotenv.config();
console.log("ENV Check:", {
  port: process.env.PORT,
  gemini: process.env.GEMINI_API_KEY ? "loaded" : "missing",
  mongo: process.env.MONGO_URI ? "loaded" : "missing",
});

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/fir", firRoutes);
app.use("/api/ai", aiRoutes);

app.get("/", (req, res) => res.send("FIR Assistant Server Running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));