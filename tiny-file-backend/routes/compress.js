import { compressHandler } from "../controllers/compress.js";

export default async function compressRoutes(fastify, options) {
  fastify.post("/compress", compressHandler);
}
