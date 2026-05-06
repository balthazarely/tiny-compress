import { historyHandler } from "../controllers/history.js";

export default async function historyRoutes(fastify, options) {
  fastify.get("/history", historyHandler);
}
