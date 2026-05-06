import { compressHandler } from "../controllers/compress.js";
import { db, isPostgres } from "../db.js";

export default async function compressRoutes(fastify, options) {
  fastify.post("/compress", compressHandler);

  fastify.get("/history", async (request, reply) => {
    const { userId } = request.query;
    let rows;

    if (isPostgres) {
      const result = await db.query(
        `
        SELECT * FROM compressions
        WHERE userId = $1
        ORDER BY createdAt DESC
        LIMIT 10
      `,
        [userId]
      );
      rows = result.rows;
    } else {
      rows = db
        .prepare(`
          SELECT * FROM compressions
          WHERE userId = ?
          ORDER BY createdAt DESC
          LIMIT 10
        `)
        .all(userId);
    }

    return rows;
  });
}
