import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  poeChatJson,
  extractImageUrlFromAssistant,
  parseDataUrl,
  getAssistantText,
} from "../lib/poe-server";

const ALLOWED_IMAGE_MODELS = [
  "GPT-Image-1.5",
  "Imagen-4",
  "FLUX-pro-1.1",
  "DALL-E-3",
  "FLUX-schnell",
];
const PROMPT_HELPER_MODEL = process.env.POE_IMAGE_PROMPT_MODEL || "Gemini-3-Pro";
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
    if ((!text || text.trim().length === 0) && (!files || files.length === 0)) {
      return res.status(400).json({ error: "Text or files are required" });
    }

    const imageModel =
      model && ALLOWED_IMAGE_MODELS.includes(model) ? model : "GPT-Image-1.5";

    let promptInput = "";
    if (text && text.trim()) {
      promptInput = text.trim().substring(0, 2000);
    }
    if (directions) {
      promptInput += `\n\nArtistic style preferences: ${directions}`;
    }

    const textModelContent: Array<Record<string, unknown>> = [
      {
        type: "text",
        text: `You are an expert image prompt engineer for a creativity app. Users paste thoughts, quotes, notes, or attach reference images. Some want a literal scene; others want a symbolic or metaphorical visualization.

Write exactly ONE image-generation prompt: the raw text an image model should use. No title, no preamble, no markdown, no quotation marks around the prompt, no bullet lists.

How to interpret the input:
- If the user describes something concrete (objects, places, people, actions), keep it faithful and specific; do not replace it with abstraction unless the text is clearly metaphorical or emotional-only.
- If the input is abstract, emotional, or aphoristic, translate it into a single strong visual metaphor or symbolic scene that preserves the mood and theme.
- If "Content to visualize" is empty or only has style notes but reference images are attached, infer subject, mood, palette, and composition from those images and describe one cohesive scene.
- If both text and images are present, merge them unless they conflict; when they conflict, follow the text.

Quality bar for the prompt you output:
- One clear focal idea and composition (avoid cluttered "kitchen sink" descriptions unless the user asks for that).
- Concrete sensory detail: lighting, color palette, materials/textures, atmosphere, and spatial layout where it helps.
- Honor any "Artistic style preferences" below; they override your default style choices when they specify medium or look.
- The image must contain no text, letters, numbers, logos, captions, signage, or watermarks—purely visual.
- If the source material is intense or graphic, keep emotional weight using atmosphere, symbolism, or suggestion rather than explicit gore or sexual content (reduces model refusals while staying true to tone).
- Aim for roughly 2–5 sentences, or one dense paragraph, and stay under 1200 characters.

Content to visualize:
${promptInput}

Output only the final image prompt, nothing else.`,
      },
    ];

    if (files && Array.isArray(files) && files.length > 0) {
      for (const file of files) {
        if (file.type?.startsWith("image/") && file.url?.startsWith("data:")) {
          // Images → image_url block so the vision model can see them
          const parsed = parseDataUrl(file.url);
          if (parsed) {
            textModelContent.push({
              type: "image_url",
              image_url: { url: file.url },
            });
          }
        } else if (
          file.type === "application/pdf" ||
          file.type === "application/msword" ||
          file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {
          // PDFs & Word docs → Poe file block
          textModelContent.push({
            type: "file",
            file: {
              filename: file.name,
              file_data: file.url,
            },
          });
        }
        // Plain text files are already folded into promptInput via the text field;
        // binary types we can't parse are silently skipped (no placeholder needed
        // since the user sees the file name in the UI).
      }
    }

    const promptData = await poeChatJson(apiKey, {
      model: PROMPT_HELPER_MODEL,
      messages: [{ role: "user", content: textModelContent }],
      max_tokens: 1500,
    });

    const optimizedPrompt = getAssistantText(promptData!).trim();
    if (!optimizedPrompt) {
      throw new Error("Failed to generate optimized prompt");
    }

    const imageData = await poeChatJson(apiKey, {
      model: imageModel,
      messages: [{ role: "user", content: optimizedPrompt }],
      max_tokens: 4096,
    });

    const { imageUrl, text: textResponse, finishReason } = extractImageUrlFromAssistant(imageData!);

    if (!imageUrl) {
      const errorMsg =
        finishReason === "safety" || finishReason === "content_filter"
          ? "The content was flagged by safety filters. Try rephrasing or using more abstract language."
          : "No image was generated. Try simplifying your input, choosing another image model, or adjusting artistic direction.";
      return res.status(422).json({ error: errorMsg });
    }

    return res.status(200).json({
      imageUrl,
      description: textResponse || "",
      generatedPrompt: optimizedPrompt,
    });
  } catch (e: unknown) {
    const err = e as { status?: number; message?: string };
    const status = err.status && err.status >= 400 && err.status < 600 ? err.status : 500;
    const message = e instanceof Error ? e.message : "Failed to generate image";
    if (status === 429) {
      return res.status(429).json({ error: "Rate limit exceeded. Please wait a moment and try again." });
    }
    if (status === 402) {
      return res
        .status(402)
        .json({ error: "Insufficient Poe points. Check your subscription or add-on points at poe.com." });
    }
    console.error("generate-image:", e);
    return res.status(status >= 400 && status < 600 ? status : 500).json({ error: message });
  }
}
