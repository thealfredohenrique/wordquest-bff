import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { askRequestSchema } from "../schemas/ask";
import { generateWords } from "../services/gemini";

export async function askRoutes(app: FastifyInstance) {
  app.post(
    "/ask",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const parseResult = askRequestSchema.safeParse(request.body);

      if (!parseResult.success) {
        return reply.status(400).send({
          error: "Invalid request",
          details: parseResult.error.issues.map((i) => i.message),
        });
      }

      try {
        const words = await generateWords(parseResult.data);
        return reply.send(words);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unknown error";
        request.log.error({ err }, "Failed to generate words");
        return reply.status(502).send({
          error: "Failed to generate vocabulary words. Please try again.",
          details: message,
        });
      }
    }
  );
}
