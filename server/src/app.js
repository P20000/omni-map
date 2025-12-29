const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "../public")));

// API Routes
app.get("/api/dashboard/stats", (req, res) => {
  res.json({ nodes: "12", health: "98%", speed: "4m 12s" });
});

app.get("/api/dashboard/events", (req, res) => {
  res.json([
    { time: new Date().toLocaleTimeString(), type: "system", msg: "Omni-Map Docker Container Active", color: "success" }
  ]);
});

// The "catchall" handler: for any request that doesn't match an API route, send back React's index.html file.
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.listen(PORT, () => {
  console.log(`Omni-Server running on port ${PORT}`);
});
