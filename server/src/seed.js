const { createClient } = require("@libsql/client");
require("dotenv").config();

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function seed() {
  console.log("?? Seeding Turso with Omni-Map dummy data...");
  
  try {
    // Clear existing events for a clean start
    await client.execute("DELETE FROM events");

    const dummyEvents = [
      { type: 'github', msg: 'New PR merged: feat/ui-overhaul', color: 'primary' },
      { type: 'jenkins', msg: 'Build #104 Successful (Main Branch)', color: 'success' },
      { type: 'aws', msg: 'Auto-scaling: Added 2 t3.micro instances', color: 'secondary' },
      { type: 'system', msg: 'Database Migration Completed', color: 'info' },
      { type: 'github', msg: 'Hotfix: Resolved memory leak in agent', color: 'warning' }
    ];

    for (const event of dummyEvents) {
      await client.execute({
        sql: "INSERT INTO events (type, msg, color) VALUES (?, ?, ?)",
        args: [event.type, event.msg, event.color]
      });
    }

    console.log("? Successfully seeded 5 events.");
  } catch (err) {
    console.error("? Seeding failed:", err);
  } finally {
    process.exit();
  }
}

seed();
