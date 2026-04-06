import { poeChatJson, extractImageUrlFromAssistant, withCorsAndAuth } from "../lib/poe-server";

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

export default withCorsAndAuth(async (req, res, apiKey) => {
  const { prompt, model } = req.body as {
    prompt?: string;
    model?: string;
  };

  if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
    return void res.status(400).json({ error: "An optimized prompt is required" });
  }

  const imageModel = model && ALLOWED_IMAGE_MODELS.includes(model) ? model : "gpt-image-1.5";

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
    return void res.status(422).json({ error: errorMsg });
  }

  return void res.status(200).json({
    imageUrl,
    description: textResponse || "",
  });
});