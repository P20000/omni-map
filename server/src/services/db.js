const { createClient } = require("@libsql/client");
require("dotenv").config();

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const db = {
  // Example: Fetch all system events
  async getEvents() {
    const result = await client.execute("SELECT * FROM events ORDER BY created_at DESC LIMIT 5");
    return result.rows;
  },

  // Example: Save a new map diagram
  async saveMap(name, data) {
    await client.execute({
      sql: "INSERT INTO maps (name, graph_data) VALUES (?, ?)",
      args: [name, JSON.stringify(data)],
    });
  }
};

module.exports = db;
