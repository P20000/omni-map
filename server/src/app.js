const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./services/db");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API: Fetch stats (We can add a 'stats' table to Turso later)
app.get("/api/dashboard/stats", (req, res) => {
  res.json({ nodes: "1", health: "100%", speed: "0s" });
});

// API: Fetch real events from Turso
app.get("/api/dashboard/events", async (req, res) => {
  try {
    const rows = await db.getEvents();
    // Map Turso rows to the format our frontend expects
    const formattedEvents = rows.map(row => ({
      time: new Date(row.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: row.type,
      msg: row.msg,
      color: row.color
    }));
    res.json(formattedEvents);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch events from Turso" });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.listen(PORT, () => {
  console.log(`Omni-Server running on port ${PORT}`);
});
