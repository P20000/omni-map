const { createClient } = require("@libsql/client");
require("dotenv").config();

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const db = {
  // --- READ METHODS (For Dashboard) ---
  
  getStats: async () => {
    // We fetch the latest numbers stored in the stats table
    const result = await client.execute("SELECT * FROM system_stats LIMIT 1");
    if (result.rows.length === 0) return { active_nodes: 0, health_score: 100, deploy_speed: "0ms" };
    return result.rows[0];
  },

  getEvents: async () => {
    const result = await client.execute("SELECT * FROM events ORDER BY created_at DESC LIMIT 5");
    return result.rows;
  },

  // Save a credential for a specific project
  saveProjectCredential: async (projectId, provider, apiKey) => {
    // We use 'global' as node_id for now since it's a general project key
    const result = await client.execute({
      sql: "INSERT INTO project_credentials (architecture_id, node_id, provider, api_key) VALUES (?, ?, ?, ?)",
      args: [projectId, 'global', provider, apiKey]
    });
    return result;
  },

  // Get credentials for a specific project
  getProjectCredentials: async (projectId) => {
    const result = await client.execute({
      sql: "SELECT id, provider, created_at FROM project_credentials WHERE architecture_id = ? ORDER BY created_at DESC",
      args: [projectId]
    });
    return result.rows;
  },

  // --- ARCHITECTURE METHODS ---
  createArchitecture: async (name, description) => {
    const res = await client.execute({
      sql: "INSERT INTO architectures (name, description) VALUES (?, ?)",
      args: [name, description]
    });
    return res.lastInsertRowid; // Return the ID so frontend can switch to it
  },

  getAllArchitectures: async () => {
    const res = await client.execute("SELECT * FROM architectures ORDER BY created_at DESC");
    return res.rows;
  },

  // --- SCOPED CREDENTIALS METHODS ---
  // Save a key specifically for one project
  saveNodeCredential: async (archId, nodeId, provider, apiKey) => {
    await client.execute({
      sql: "INSERT INTO project_credentials (architecture_id, node_id, provider, api_key) VALUES (?, ?, ?, ?)",
      args: [archId, nodeId, provider, apiKey]
    });
    return true;
  },

  // Get keys ONLY for the current project
  getProjectCredentials: async (archId) => {
    const res = await client.execute({
      sql: "SELECT * FROM project_credentials WHERE architecture_id = ?",
      args: [archId]
    });
    return res.rows;
  }
};



module.exports = db;