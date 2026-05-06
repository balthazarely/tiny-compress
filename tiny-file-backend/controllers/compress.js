import sharp from "sharp";

export async function compressHandler(request, reply) {
  let buffer = null;
  let format = "webp";
  let quality = 75;

  const parts = request.parts();
  for await (const part of parts) {
    if (part.type === "file") {
      buffer = await part.toBuffer();
    } else if (part.type === "field") {
      if (part.fieldname === "format") {
        format = part.value;
      } else if (part.fieldname === "quality") {
        quality = parseInt(part.value);
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

  return {
    originalSize: buffer.length,
    compressedSize: compressed.length,
    file: compressed.toString("base64"),
    fileType: mimeTypes[format] || "image/webp",
  };
}

export async function healthHandler(request, reply) {
  return { hello: "world" };
}
