import type { VercelRequest, VercelResponse } from "@vercel/node";
import { poeChatJson, getAssistantText } from "../lib/poe-server";

const ALLOWED_MODELS = [
  "Gemini-3-Pro",
  "Gemini-3-Flash",
  "Claude-Sonnet-4.6",
  "Claude-Opus-4.6",
  "GPT-5.4",
  "Grok-4",
];
const DEFAULT_MODEL = "Gemini-3-Flash";
const MAX_TEXT_LENGTH = 50000;
const MAX_DIRECTIONS_LENGTH = 5000;

function setCors(res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.POE_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "POE_API_KEY is not configured on the server" });
  }

  try {
    const { text, directions, model } = req.body as {
      text?: string;
      directions?: string;
      model?: string;
    };

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return res.status(400).json({ error: "Text content is required" });
    }
    if (text.length > MAX_TEXT_LENGTH) {
      return res.status(400).json({ error: "Text exceeds maximum length" });
    }
    if (directions && typeof directions === "string" && directions.length > MAX_DIRECTIONS_LENGTH) {
      return res.status(400).json({ error: "Directions exceed maximum length" });
    }

    const modelToUse =
      model && ALLOWED_MODELS.includes(model) ? model : DEFAULT_MODEL;

    let systemContent = `You are an expert prompt engineer for image generation models. Your task is to convert a user's idea into a single, comprehensive, and descriptive narrative prompt.

MANDATE:
- You MUST ALWAYS generate a prompt from the user's input.
- If the input is vague, interpret it creatively to produce a rich and interesting prompt. Do not ask for clarification or state that the input is unclear.
- The final prompt must be a comprehensive and descriptive narrative, adhering to a maximum length of 1024 characters.

GUIDELINES FOR PROMPT CREATION:
- Specificity: Use precise details about the subject, colors, mood, and composition.
- Style & Medium: Suggest a visual style (e.g., photorealistic, watercolor, cyberpunk) and medium.
- Subject Matter: Clearly describe objects, characters, or elements with their defining traits.
- Composition & Perspective: Employ unique viewpoints like bird's-eye view, close-up, or wide-angle.
- Dynamic Elements: Incorporate action, movement, or energy to make the scene feel alive.
- Emotion & Tone: Evoke a specific mood or feeling to enhance the storytelling.
- Narrative Context: Add depth with a hint of backstory or scene-setting.
- Personalization: If the user's input includes a person's name, make sure to use that name in the prompt.
- Focus: Ensure the entire prompt is focused, relevant, and directly actionable by the image generator.

Your output should be ONLY the generated prompt text.`;

    if (directions && typeof directions === "string" && directions.trim().length > 0) {
      systemContent += `\n\nAdditional instructions: ${directions.trim()}`;
    }

    const messages = [
      { role: "system" as const, content: systemContent },
      {
        role: "user" as const,
        content: `Idea to convert to Flux prompt: ${text.trim()}`,
      },
    ];

    const data = await poeChatJson(apiKey, {
      model: modelToUse,
      messages,
      temperature: 0.7,
      max_tokens: 1500,
    });

    const generatedPrompt = getAssistantText(data!).trim();
    return res.status(200).json({ prompt: generatedPrompt });
  } catch (e: unknown) {
    const err = e as { status?: number; message?: string };
    const status = err.status && err.status >= 400 && err.status < 600 ? err.status : 500;
    const message = e instanceof Error ? e.message : "Failed to generate prompt";
    if (status === 429) {
      return res.status(429).json({ error: "Rate limit exceeded. Please try again in a moment." });
    }
    if (status === 402) {
      return res
        .status(402)
        .json({ error: "Insufficient Poe points. Check your subscription or add-on points at poe.com." });
    }
    console.error("generate-flux-prompt:", e);
    return res.status(status >= 400 && status < 600 ? status : 500).json({ error: message });
  }
}
