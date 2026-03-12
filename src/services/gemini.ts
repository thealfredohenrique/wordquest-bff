import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AskRequest, WordEntry } from "../schemas/ask";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const THEME_LABELS: Record<string, string> = {
  travel: "Travel & Tourism",
  business: "Business & Corporate",
  technology: "Technology & Computing",
  food: "Food & Cooking",
  sports: "Sports & Fitness",
  daily: "Daily Life & Routine",
  entertainment: "Entertainment & Media",
  health: "Health & Medicine",
};

const DIFFICULTY_INSTRUCTIONS: Record<string, string> = {
  easy: "Use common, everyday English words that a beginner would encounter. Think A1-A2 CEFR level.",
  medium:
    "Use intermediate English words that a B1-B2 level student should learn. Words should be useful but not overly simple.",
  hard: "Use advanced, sophisticated English words at C1-C2 CEFR level. Include idiomatic expressions, phrasal verbs, or less common vocabulary.",
};

function buildPrompt(params: AskRequest): string {
  const themeLabel = THEME_LABELS[params.theme] || params.theme;
  const difficultyGuide = DIFFICULTY_INSTRUCTIONS[params.difficulty] || "";

  return `You are an English vocabulary tutor. Generate exactly ${params.count} English vocabulary words related to the theme "${themeLabel}".

${difficultyGuide}

For each word, provide:
1. "word": The English word or phrase
2. "description": A clear explanation of the word IN PORTUGUESE (Brazilian Portuguese)
3. "useCase": An example sentence IN ENGLISH showing how the word is used in context
4. "alternatives": An array of exactly 3 OTHER English words that are plausible but INCORRECT alternatives. They should be from the same semantic field and similar difficulty level, making the quiz challenging but fair. Do NOT include the correct word in the alternatives.

CRITICAL RULES:
- Return ONLY a valid JSON array, no markdown, no code blocks, no explanation
- Each object must have exactly the fields: word, description, useCase, alternatives
- The "alternatives" array must have exactly 3 strings
- All ${params.count} words must be unique
- All alternative words must be different from the correct word and from each other
- Descriptions must be in Brazilian Portuguese
- Use cases must be natural English sentences

Example format:
[{"word":"Breakthrough","description":"Um avanço significativo ou descoberta importante","useCase":"The team achieved a major breakthrough in AI research.","alternatives":["Setback","Obstacle","Routine"]}]`;
}

export async function generateWords(params: AskRequest): Promise<WordEntry[]> {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      temperature: 0.8,
      maxOutputTokens: 4096,
    },
  });

  const prompt = buildPrompt(params);
  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();

  // Clean potential markdown code blocks from response
  const cleaned = text
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();

  const parsed: WordEntry[] = JSON.parse(cleaned);

  // Validate structure
  if (!Array.isArray(parsed)) {
    throw new Error("Gemini response is not an array");
  }

  for (const entry of parsed) {
    if (
      !entry.word ||
      !entry.description ||
      !entry.useCase ||
      !Array.isArray(entry.alternatives) ||
      entry.alternatives.length !== 3
    ) {
      throw new Error("Invalid word entry structure from Gemini");
    }
  }

  return parsed;
}
