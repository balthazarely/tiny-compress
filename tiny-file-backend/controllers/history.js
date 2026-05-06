import db from "../db.js";

export async function historyHandler(request, reply) {
  const rows = db
    .prepare(
      `
        SELECT * FROM compressions
        ORDER BY createdAt DESC
        LIMIT 10
      `,
    )
    .all();
  return rows;
}
