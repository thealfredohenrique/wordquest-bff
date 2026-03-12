import { z } from "zod";

const VALID_THEMES = [
  "travel",
  "business",
  "technology",
  "food",
  "sports",
  "daily",
  "entertainment",
  "health",
] as const;

const VALID_DIFFICULTIES = ["easy", "medium", "hard"] as const;

export const askRequestSchema = z.object({
  theme: z.enum(VALID_THEMES, {
    errorMap: () => ({
      message: `Theme must be one of: ${VALID_THEMES.join(", ")}`,
    }),
  }),
  difficulty: z.enum(VALID_DIFFICULTIES, {
    errorMap: () => ({
      message: `Difficulty must be one of: ${VALID_DIFFICULTIES.join(", ")}`,
    }),
  }),
  count: z.number().int().min(1).max(20).default(10),
});

export type AskRequest = z.infer<typeof askRequestSchema>;

export interface WordEntry {
  word: string;
  description: string;
  useCase: string;
  alternatives: string[];
}
