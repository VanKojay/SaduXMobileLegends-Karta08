import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import healthRoute from "./routes/health.js";
import { sequelize } from "./db.js";
import authRoute from "./routes/auth.js";
import eventsRoute from "./routes/events.js";
import teamsRoute from "./routes/teams.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/health", healthRoute);
app.use("/api/auth", authRoute);
app.use("/api/events", eventsRoute);
app.use("/api/teams", teamsRoute);
// Default route
app.get("/", (req, res) => {
  res.send("SaduX Mobile Legends Backend is Live 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// basic error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Server error" });
});
