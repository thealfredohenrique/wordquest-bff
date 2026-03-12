import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import { healthRoutes } from "./routes/health";
import { askRoutes } from "./routes/ask";

const app = Fastify({
  logger: true,
});

async function bootstrap() {
  // Security headers
  await app.register(helmet);

  // CORS — allow front-end origins
  await app.register(cors, {
    origin: process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(",")
      : ["http://localhost:3000"],
    methods: ["GET", "POST"],
  });

  // Rate limiting — protect Gemini API usage
  await app.register(rateLimit, {
    max: 30,
    timeWindow: "1 minute",
  });

  // Routes
  await app.register(healthRoutes);
  await app.register(askRoutes);

  // Start server
  const port = Number(process.env.PORT) || 3001;
  const host = "0.0.0.0";

  try {
    await app.listen({ port, host });
    app.log.info(`WordQuest BFF running on http://${host}:${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

bootstrap();
