const pool = require("../config/db");
const fs = require("fs");
const path = require("path");

async function initializeDatabase() {
  try {
    console.log("Checking database tables...");

    const checkQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `;

    const result = await pool.query(checkQuery);
    const tablesExist = result.rows[0].exists;

    if (!tablesExist) {
      console.log("Tables don't exist. Creating database schema...");

      const schemaPath = path.join(__dirname, "../database/schema.sql");
      const schema = fs.readFileSync(schemaPath, "utf-8");

      await pool.query(schema);

      console.log("✅ Database schema created successfully!");
    } else {
      console.log("✅ Database tables already exist.");
    }
  } catch (error) {
    console.error("❌ Error initializing database:", error.message);
  }
}

module.exports = initializeDatabase;
