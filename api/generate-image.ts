import type { VercelRequest, VercelResponse } from "@vercel/node";
import { poeChatJson, extractImageUrlFromAssistant } from "../lib/poe-server";

const ALLOWED_IMAGE_MODELS = [
  "gpt-image-1.5",
  "imagen-4",
  "imagen-4-ultra",
  "nano-banana-2",
  "nano-banana",
  "nano-banana-pro",
  "grok-imagine-image",
  "flux-pro-1.1",
  "flux-2-pro",
  "dall-e-3",
  "wan-2.7",
  "seedream-5.0-lite",
  "seedream-4.5",
  "flux-schnell",
];

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
    const { prompt, model } = req.body as {
      prompt?: string;
      model?: string;
    };

    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return res.status(400).json({ error: "An optimized prompt is required" });
    }

    const imageModel =
      model && ALLOWED_IMAGE_MODELS.includes(model) ? model : "gpt-image-1.5";

    const imageData = await poeChatJson(apiKey, {
      model: imageModel,
      messages: [{ role: "user", content: prompt.trim() }],
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
