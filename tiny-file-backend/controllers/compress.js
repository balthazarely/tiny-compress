import sharp from "sharp";
import crypto from "crypto";
import { db, isPostgres } from "../db.js";

export async function compressHandler(request, reply) {
  let buffer = null;
  let format = "webp";
  let quality = 75;
  let filename = "image";
  let userId = "anonymous";

  const parts = request.parts();
  for await (const part of parts) {
    if (part.type === "file") {
      buffer = await part.toBuffer();
    } else if (part.type === "field") {
      if (part.fieldname === "format") {
        format = part.value;
      } else if (part.fieldname === "quality") {
        quality = parseInt(part.value);
      } else if (part.fieldname === "filename") {
        filename = part.value;
      } else if (part.fieldname === "userId") {
        userId = part.value;
      }
    }
  }

  const mimeTypes = {
    webp: "image/webp",
    avif: "image/avif",
    jpeg: "image/jpeg",
    png: "image/png",
  };

  const compressed = await sharp(buffer)
    .toFormat(format, { quality })
    .toBuffer();

  const nameWithoutExt = filename.replace(/\.[^/.]+$/, "");
  const compressedFilename = `${nameWithoutExt}-compressed.${format}`;

  // After you get the buffer, create a hash of it
  const fileHash = crypto.createHash("sha256").update(buffer).digest("hex");

  // Check if this user has already compressed this file
  let existing;
  if (isPostgres) {
    const result = await db.query(
      `SELECT id FROM compressions WHERE userId = $1 AND fileHash = $2`,
      [userId, fileHash]
    );
    existing = result.rows.length > 0 ? result.rows[0] : null;
  } else {
    existing = db
      .prepare(`SELECT id FROM compressions WHERE userId = ? AND fileHash = ?`)
      .get(userId, fileHash);
  }

  if (!existing) {
    // Only insert if it's a new file for this user
    if (isPostgres) {
      await db.query(
        `
        INSERT INTO compressions (userId, filename, originalSize, compressedSize, format, quality, file, fileHash)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `,
        [
          userId,
          filename,
          buffer.length,
          compressed.length,
          format,
          quality,
          compressed.toString("base64"),
          fileHash,
        ]
      );
    } else {
      db.prepare(
        `
        INSERT INTO compressions (userId, filename, originalSize, compressedSize, format, quality, file, fileHash)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `
      ).run(
        userId,
        filename,
        buffer.length,
        compressed.length,
        format,
        quality,
        compressed.toString("base64"),
        fileHash
      );
    }
  }

  return {
    originalSize: buffer.length,
    compressedSize: compressed.length,
    file: compressed.toString("base64"),
    fileType: mimeTypes[format] || "image/webp",
    filename: compressedFilename,
  };
}

export async function healthHandler(request, reply) {
  return { hello: "world" };
}
