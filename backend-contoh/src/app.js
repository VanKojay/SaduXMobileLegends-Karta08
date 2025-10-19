import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import healthRoute from "./routes/health.js";
import db from "./db.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/health", healthRoute);
// Default route
app.get("/", (req, res) => {
  res.send("SaduX Mobile Legends Backend is Live 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
