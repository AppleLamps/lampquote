import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  decodeDataUrlText,
  poeChatJson,
  getAssistantText,
  type ChatMessage,
} from "../lib/poe-server";

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
const MAX_FILES = 10;

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
    const { text, files, directions, model } = req.body as {
      text?: string;
      files?: Array<{ name: string; type: string; url: string }>;
      directions?: string;
      model?: string;
    };

    if (text && typeof text === "string" && text.length > MAX_TEXT_LENGTH) {
      return res.status(400).json({ error: "Text exceeds maximum length" });
    }
    if (directions && typeof directions === "string" && directions.length > MAX_DIRECTIONS_LENGTH) {
      return res.status(400).json({ error: "Directions exceed maximum length" });
    }
    if (files && Array.isArray(files) && files.length > MAX_FILES) {
      return res.status(400).json({ error: `Maximum ${MAX_FILES} files allowed` });
    }

    const modelToUse =
      model && ALLOWED_MODELS.includes(model) ? model : DEFAULT_MODEL;

    if ((!text || text.trim().length === 0) && (!files || files.length === 0)) {
      return res.status(400).json({ error: "Either text content or files are required" });
    }

    let systemContent = `You are an intent-capturing quote generator. Analyze any text or image description and distill its core emotional energy, tone, and underlying message into the most impactful quote possible.

CORE DIRECTIVES:

1. Capture the Essence: Identify the dominant emotion (anger, joy, despair, sarcasm, etc.), energy level (calm vs. intense), and core message.
2. Mirror the Tone: Replicate the original tone authentically—profane, intellectual, raw, humorous, or offensive. Never sanitize.
3. Embrace Raw Authenticity: Use any language necessary, including profanity, slang, or controversial phrasing, if it truthfully reflects the input's energy. Never censor or dilute.
4. Prioritize Impact Over Politeness: Emotional resonance matters above all. Clarity, memorability, and emotional truth outweigh social niceties.
5. No Antithesis Constructions: Never use "not X, but Y" contrasts, "less X, more Y" pivots, or any rhetorical antithesis pattern. Write plain, direct prose that carries the meaning through imagery, metaphor, or raw statement. Every clause should stand on its own and push forward.

ADAPTING TO INPUT:
- Text: Extract subtext, implied attitudes, and linguistic style.
- Images: Interpret visual cues (expressions, settings, symbols) into emotional equivalents.

PARAMETERS:
- Output exactly one quote per input (20–40 words ideal).
- Match the source's register: academic input becomes profound; a rant stays aggressive; humor stays sharp.
- Default to raw authenticity over refinement. A flawed, truthful quote beats a polished, hollow one.`;

    if (directions && typeof directions === "string" && directions.trim().length > 0) {
      systemContent += `\n\nAdditional instructions: ${directions.trim()}`;
    }

    const messages: ChatMessage[] = [{ role: "system", content: systemContent }];

    const userMessageContent: Array<Record<string, unknown>> = [];

    if (text && text.trim().length > 0) {
      userMessageContent.push({ type: "text", text: `Text content: ${text.trim()}` });
    }

    if (files && Array.isArray(files) && files.length > 0) {
      for (const file of files) {
        try {
          if (file.type?.startsWith("image/") && file.url?.startsWith("data:")) {
            // Images → Poe image_url block
            userMessageContent.push({
              type: "image_url",
              image_url: { url: file.url, detail: "high" },
            });
          } else if (
            file.type === "text/plain" ||
            file.type === "text/markdown" ||
            file.type === "application/json"
          ) {
            // Plain text → decode and inline so any model can read it
            const decoded =
              file.url?.startsWith("data:") && decodeDataUrlText(file.url, 50000);
            if (decoded) {
              userMessageContent.push({
                type: "text",
                text: `Content from ${file.name}:\n${decoded}`,
              });
            } else {
              userMessageContent.push({ type: "text", text: `[File: ${file.name}]` });
            }
          } else if (
            file.type === "application/pdf" ||
            file.type === "application/msword" ||
            file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
            file.type === "application/vnd.oasis.opendocument.text"
          ) {
            // PDFs & Word docs → Poe file block (supported by vision-capable models)
            userMessageContent.push({
              type: "file",
              file: {
                filename: file.name,
                file_data: file.url,
              },
            });
          } else {
            userMessageContent.push({ type: "text", text: `[File: ${file.name}]` });
          }
        } catch {
          userMessageContent.push({
            type: "text",
            text: `[File attached: ${file.name} - could not process content]`,
          });
        }
      }
    }

    if (userMessageContent.length === 0) {
      userMessageContent.push({ type: "text", text: "Please generate a profound quote or reflection." });
    }

    messages.push({ role: "user", content: userMessageContent });

    const data = await poeChatJson(apiKey, {
      model: modelToUse,
      messages,
      temperature: 0.7,
      max_tokens: 1500,
    });

    const generatedQuote = getAssistantText(data!).trim();
    if (!generatedQuote) {
      throw new Error("Empty quote generated");
    }

    return res.status(200).json({ quote: generatedQuote });
  } catch (e: unknown) {
    const err = e as { status?: number; message?: string };
    const status = err.status && err.status >= 400 && err.status < 600 ? err.status : 500;
    const message = e instanceof Error ? e.message : "Failed to generate quote";
    if (status === 429) {
      return res.status(429).json({ error: "Rate limit exceeded. Please try again in a moment." });
    }
    if (status === 402) {
      return res
        .status(402)
        .json({ error: "Insufficient Poe points. Check your subscription or add-on points at poe.com." });
    }
    console.error("generate-quote:", e);
    return res.status(status >= 400 && status < 600 ? status : 500).json({ error: message });
  }
}
