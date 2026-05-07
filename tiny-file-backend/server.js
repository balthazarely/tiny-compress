import Fastify from "fastify";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import "./db.js";
import compressRoutes from "./routes/compress.js";
import historyRoutes from "./routes/history.js";

const fastify = Fastify({
  logger: true,
});

// Middleware
fastify.register(cors, { origin: true });
fastify.register(multipart, {
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
});

// GET / route (health check)
fastify.get("/", async (request, reply) => {
  return { status: "ok", message: "Backend is running" };
});

// Routes
fastify.register(compressRoutes);
fastify.register(historyRoutes);

const port = Number(process.env.PORT) || 3000;

const start = async () => {
  try {
    await fastify.listen({ host: "0.0.0.0", port });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

process.on("SIGTERM", (signal) => {
  console.log(`Received ${signal} — shutting down`);
  fastify.close(() => process.exit(0));
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
  process.exit(1);
});
