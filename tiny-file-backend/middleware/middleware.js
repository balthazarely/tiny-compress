import cors from "@fastify/cors";
import multipart from "@fastify/multipart";

export default async function middleware(fastify, options) {
  await fastify.register(cors, { origin: true });
  await fastify.register(multipart);
}
