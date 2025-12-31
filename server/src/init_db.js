const { createClient } = require("@libsql/client");
require("dotenv").config();

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function initDB() {
  console.log("🛠️ restructuring Database for Multi-Architecture Support...");
  
  try {
    // 1. ARCHITECTURES (The Container for everything)
    await client.execute(`
      CREATE TABLE IF NOT EXISTS architectures (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 2. CREDENTIALS (Now linked to an architecture_id)
    // We removed the 'Active' status because existence implies activity
    await client.execute(`
      CREATE TABLE IF NOT EXISTS project_credentials (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        architecture_id INTEGER NOT NULL,
        node_id TEXT NOT NULL,  -- The ID of the specific node in the editor
        provider TEXT NOT NULL, -- 'aws', 'github', etc.
        api_key TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(architecture_id) REFERENCES architectures(id)
      )
    `);

    // 3. NODES (To save the diagram positions)
    await client.execute(`
      CREATE TABLE IF NOT EXISTS project_nodes (
        id TEXT PRIMARY KEY,    -- UUID from React Flow
        architecture_id INTEGER NOT NULL,
        type TEXT NOT NULL,
        position_x REAL,
        position_y REAL,
        data JSON,              -- Stores labels, config, etc.
        FOREIGN KEY(architecture_id) REFERENCES architectures(id)
      )
    `);

    console.log("✅ Multi-Architecture Schema Applied.");

  } catch (err) {
    console.error("❌ Init failed:", err);
  }
}

initDB();