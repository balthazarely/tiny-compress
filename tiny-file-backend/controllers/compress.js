import sharp from "sharp";
import crypto from "crypto";
import { db, isPostgres } from "../db.js";

const MIME_TYPES = {
  webp: "image/webp",
  avif: "image/avif",
  jpeg: "image/jpeg",
  png: "image/png",
};

const MAX_COMPRESSIONS_PER_USER = 5;

const parseMultipart = async (request) => {
  const data = {
    format: "webp",
    quality: 75,
    filename: "image",
    userId: "anonymous",
  };
  let buffer = null;

  for await (const part of request.parts()) {
    if (part.type === "file") {
      buffer = await part.toBuffer();
    } else if (part.type === "field") {
      if (part.fieldname === "quality") {
        data.quality = parseInt(part.value);
      } else {
        data[part.fieldname] = part.value;
      }
    }
  }

  return { buffer, ...data };
};

const dbHelpers = {
  checkExisting: async (userId, fileHash) => {
    if (isPostgres) {
      const result = await db.query(
        `SELECT id FROM compressions WHERE userId = $1 AND fileHash = $2`,
        [userId, fileHash],
      );
      return result.rows[0] || null;
    }
    return db
      .prepare(`SELECT id FROM compressions WHERE userId = ? AND fileHash = ?`)
      .get(userId, fileHash);
  },

  getUserCount: async (userId) => {
    if (isPostgres) {
      const result = await db.query(
        `SELECT COUNT(*) as count FROM compressions WHERE userId = $1`,
        [userId],
      );
      return parseInt(result.rows[0].count);
    }
    return db
      .prepare(`SELECT COUNT(*) as count FROM compressions WHERE userId = ?`)
      .get(userId).count;
  },

  deleteOldest: async (userId) => {
    if (isPostgres) {
      await db.query(
        `DELETE FROM compressions WHERE userId = $1 AND id = (SELECT id FROM compressions WHERE userId = $1 ORDER BY createdAt ASC LIMIT 1)`,
        [userId],
      );
    } else {
      const oldest = db
        .prepare(
          `SELECT id FROM compressions WHERE userId = ? ORDER BY createdAt ASC LIMIT 1`,
        )
        .get(userId);
      if (oldest) {
        db.prepare(`DELETE FROM compressions WHERE id = ?`).run(oldest.id);
      }
    }
  },

  insertCompression: async (
    userId,
    filename,
    originalSize,
    compressedSize,
    format,
    quality,
    file,
    fileHash,
  ) => {
    const values = [
      userId,
      filename,
      originalSize,
      compressedSize,
      format,
      quality,
      file,
      fileHash,
    ];
    if (isPostgres) {
      await db.query(
        `INSERT INTO compressions (userId, filename, originalSize, compressedSize, format, quality, file, fileHash) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        values,
      );
    } else {
      db.prepare(
        `INSERT INTO compressions (userId, filename, originalSize, compressedSize, format, quality, file, fileHash) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      ).run(...values);
    }
  },
};

export async function compressHandler(request, reply) {
  const { buffer, format, quality, filename, userId } =
    await parseMultipart(request);

  const compressed = await sharp(buffer)
    .toFormat(format, { quality })
    .toBuffer();
  const fileHash = crypto.createHash("sha256").update(buffer).digest("hex");

  if (!(await dbHelpers.checkExisting(userId, fileHash))) {
    const userCount = await dbHelpers.getUserCount(userId);
    if (userCount >= MAX_COMPRESSIONS_PER_USER) {
      await dbHelpers.deleteOldest(userId);
    }

    await dbHelpers.insertCompression(
      userId,
      filename,
      buffer.length,
      compressed.length,
      format,
      quality,
      compressed.toString("base64"),
      fileHash,
    );
  }

  const compressedFilename = `${filename.replace(/\.[^/.]+$/, "")}-compressed.${format}`;

  return {
    originalSize: buffer.length,
    compressedSize: compressed.length,
    file: compressed.toString("base64"),
    fileType: MIME_TYPES[format] || "image/webp",
    filename: compressedFilename,
  };
}

export async function healthHandler(request, reply) {
  return { hello: "world" };
}
