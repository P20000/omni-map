const express = require("express");
const cors = require("cors");
const db = require("./services/db"); // Import our new service
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// --- REAL TURSO ROUTES ---

app.get("/api/dashboard/stats", async (req, res) => {
  try {
    const data = await db.getStats();
    // Map DB column names to what the React Frontend expects
    res.json({
      nodes: data.active_nodes,
      health: data.health_score + "%",
      speed: data.deploy_speed
    });
  } catch (err) {
    console.error("Stats Error:", err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

app.get("/api/dashboard/events", async (req, res) => {
  try {
    const rows = await db.getEvents();
    const formattedEvents = rows.map(row => ({
      time: new Date(row.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: row.type,
      msg: row.msg,
      color: row.color
    }));
    res.json(formattedEvents);
  } catch (err) {
    console.error("Events Error:", err);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});
// --- VAULT ROUTES ---

// SAVE a new key
app.post("/api/vault/save", async (req, res) => {
  const { projectId, provider, apiKey } = req.body;
  
  if (!projectId || !provider || !apiKey) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    await db.saveProjectCredential(projectId, provider, apiKey);
    res.json({ success: true, msg: "Saved to project vault" });
  } catch (err) {
    console.error("Vault Save Error:", err);
    res.status(500).json({ error: "Database Write Failed" });
  }
});

// GET status of keys (Don't return the actual keys for security)
app.get("/api/vault/status", async (req, res) => {
  try {
    const status = await db.getProjectCredentials();
    res.json(status);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch vault status" });
  }
});


// --- ARCHITECTURE ROUTES ---

// GET all projects
app.get("/api/architectures", async (req, res) => {
  try {
    const projects = await db.getAllArchitectures();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: "Failed to load projects" });
  }
});

// GET all projects
app.get("/api/architectures", async (req, res) => {
  try {
    const projects = await db.getAllArchitectures();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: "Failed to load projects" });
  }
});

// CREATE a new project
app.post("/api/architectures", async (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ error: "Project name is required" });

  try {
    const id = await db.createArchitecture(name, description);
    res.json({ success: true, id: id.toString() });
  } catch (err) {
    res.status(500).json({ error: "Failed to create project" });
  }
});


app.listen(PORT, () => {
  console.log(`✅ Omni-Server running on http://localhost:${PORT}`);
});