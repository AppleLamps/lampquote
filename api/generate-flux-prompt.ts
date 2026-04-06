import { poeChatJson, getAssistantText, stripAIArtifacts, withCorsAndAuth } from "../lib/poe-server.js";
import { DEFAULT_QUOTE_TEXT_MODEL, resolveAllowedTextModel } from "../lib/poe-text-models.js";
import { GROK_IMAGINE_SYSTEM_PROMPT } from "../lib/grok-imagine-system-prompt.js";
const MAX_TEXT_LENGTH = 50000;
const MAX_DIRECTIONS_LENGTH = 5000;

export default withCorsAndAuth(async (req, res, apiKey) => {
  const { text, directions, model } = req.body as {
    text?: string;
    directions?: string;
    model?: string;
  };

  if (!text || typeof text !== "string" || text.trim().length === 0) {
    return void res.status(400).json({ error: "Text content is required" });
  }
  if (text.length > MAX_TEXT_LENGTH) {
    return void res.status(400).json({ error: "Text exceeds maximum length" });
  }
  if (directions && typeof directions === "string" && directions.length > MAX_DIRECTIONS_LENGTH) {
    return void res.status(400).json({ error: "Directions exceed maximum length" });
  }

  const modelToUse = resolveAllowedTextModel(model, DEFAULT_QUOTE_TEXT_MODEL);

  let systemContent = GROK_IMAGINE_SYSTEM_PROMPT;

  if (directions && typeof directions === "string" && directions.trim().length > 0) {
    systemContent += `\n\nAdditional instructions: ${directions.trim()}`;
  }

  const messages = [
    { role: "system" as const, content: systemContent },
    { role: "user" as const, content: `User request for Grok Imagine:\n${text.trim()}` },
  ];

  const data = await poeChatJson(apiKey, {
    model: modelToUse,
    messages,
    temperature: 0.7,
    max_tokens: 3500,
  });

  const generatedPrompt = stripAIArtifacts(getAssistantText(data!));
  return void res.status(200).json({ prompt: generatedPrompt });
});