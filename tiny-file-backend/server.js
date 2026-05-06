import Fastify from "fastify";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import compressRoutes from "./routes/compress.js";

const fastify = Fastify({
  logger: true,
});

// Middleware
await fastify.register(cors, { origin: true });
await fastify.register(multipart, {
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
});

// GET / route (health check)
fastify.get("/", async (request, reply) => {
  return { status: "ok", message: "Backend is running" };
});

// POST /compress route
await fastify.register(compressRoutes);

try {
  await fastify.listen({ port: 3000 });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
