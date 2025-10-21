import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import healthRoute from "./routes/health.js";
import { sequelize } from "./db.js";
import authRoute from "./routes/auth.js";
import eventsRoute from "./routes/events.js";
import teamsRoute from "./routes/teams.js";
import groupsRoute from "./routes/groups.js";
import stagesRoute from "./routes/stages.js";
import matchesRoute from "./routes/matches.js";
import matchRoundsRoute from "./routes/matchRounds.js";
import { setupSocketHandlers } from "./socket.js";

dotenv.config();
const app = express();

// Create HTTP server
const httpServer = createServer(app);

// Setup Socket.IO with CORS
export const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:9020",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  },
  transports: ['websocket', 'polling']
});

// Setup Socket.IO handlers
setupSocketHandlers(io);

app.use(cors());
app.use(express.json());

app.use("/api/health", healthRoute);
app.use("/api/auth", authRoute);
app.use("/api/events", eventsRoute);
app.use("/api/teams", teamsRoute);
app.use("/api/groups", groupsRoute);
app.use("/api/stages", stagesRoute);
app.use("/api/matches", matchesRoute);
app.use("/api/match-rounds", matchRoundsRoute);

// Default route
app.get("/", (req, res) => {
  res.send("SaduX Mobile Legends Backend is Live 🚀 + Socket.IO ⚡");
});

// Basic error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Server error" });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`⚡ Socket.IO ready for connections`);
});
