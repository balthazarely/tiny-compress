const dbType = process.env.DATABASE_TYPE || "sqlite";

let db;
let isPostgres = false;

async function initializeDatabase() {
  if (dbType === "sqlite") {
    const DatabaseModule = await import("better-sqlite3");
    const Database = DatabaseModule.default;
    db = new Database("compressions.db");
    db.exec(`
      CREATE TABLE IF NOT EXISTS compressions (
        id INTEGER PRIMARY KEY,
        userId TEXT,
        filename TEXT,
        originalSize INTEGER,
        compressedSize INTEGER,
        format TEXT,
        quality INTEGER,
        file TEXT,
        fileHash TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  } else if (dbType === "postgres") {
    const pgModule = await import("pg");
    const { Pool } = pgModule.default;
    db = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
    isPostgres = true;
    await db.query(`
      CREATE TABLE IF NOT EXISTS compressions (
        id SERIAL PRIMARY KEY,
        userId TEXT,
        filename TEXT,
        originalSize INTEGER,
        compressedSize INTEGER,
        format TEXT,
        quality INTEGER,
        file TEXT,
        fileHash TEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `).catch((err) => {
      if (!err.message.includes("already exists")) {
        console.error("Database init error:", err.message);
      }
    });
  }
}

await initializeDatabase();

export { db, isPostgres };
