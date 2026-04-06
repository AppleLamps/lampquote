import {
  decodeDataUrlText,
  poeChatJson,
  getAssistantText,
  withCorsAndAuth,
  type ChatMessage,
} from "../lib/poe-server";

const ALLOWED_MODELS = [
  "gemini-3-flash",
  "gemini-3.1-pro",
  "gemini-2.5-flash",
  "gemini-2.5-pro",
  "claude-sonnet-4.6",
  "claude-opus-4.6",
  "claude-haiku-4.5",
  "gpt-5.4",
  "gpt-5.4-mini",
  "grok-4",
];
const DEFAULT_MODEL = "gemini-3-flash";
const MAX_TEXT_LENGTH = 50000;
const MAX_DIRECTIONS_LENGTH = 5000;
const MAX_FILES = 10;

export default withCorsAndAuth(async (req, res, apiKey) => {
  const { text, files, directions, model } = req.body as {
    text?: string;
    files?: Array<{ name: string; type: string; url: string }>;
    directions?: string;
    model?: string;
  };

  if (text && typeof text === "string" && text.length > MAX_TEXT_LENGTH) {
    return void res.status(400).json({ error: "Text exceeds maximum length" });
  }
  if (directions && typeof directions === "string" && directions.length > MAX_DIRECTIONS_LENGTH) {
    return void res.status(400).json({ error: "Directions exceed maximum length" });
  }
  if (files && Array.isArray(files) && files.length > MAX_FILES) {
    return void res.status(400).json({ error: `Maximum ${MAX_FILES} files allowed` });
  }
  if ((!text || text.trim().length === 0) && (!files || files.length === 0)) {
    return void res.status(400).json({ error: "Text or files are required" });
  }

  const modelToUse = model && ALLOWED_MODELS.includes(model) ? model : DEFAULT_MODEL;

  const userContent: Array<Record<string, unknown>> = [];

  let systemPrompt = `You are a literary artist who transforms text into profound, meaningful quotes. Your task is to:
1. Read and deeply understand the provided text
2. Extract the core meaning, emotion, or insight
3. Create ONE powerful, original quote that captures the essence

Rules:
- The quote must be original, not copied from the input
- It should be concise (1-3 sentences max)
- It should be profound and thought-provoking
- Do NOT include quotation marks around your response
- Do NOT include attribution or author names
- Output ONLY the quote text, nothing else`;

  if (directions && typeof directions === "string" && directions.trim().length > 0) {
    systemPrompt += `\n\nAdditional instructions: ${directions.trim()}`;
  }

  let mainText = "";
  if (text && text.trim()) {
    mainText = text.trim().substring(0, MAX_TEXT_LENGTH);
  }

  if (mainText) {
    userContent.push({ type: "text", text: `Text to reflect upon:\n\n${mainText}` });
  }

  if (files && Array.isArray(files) && files.length > 0) {
    for (const file of files) {
      if (file.type?.startsWith("image/") && file.url?.startsWith("data:")) {
        userContent.push({
          type: "image_url",
          image_url: { url: file.url },
        });
      } else if (
        file.type === "application/pdf" ||
        file.type === "application/msword" ||
        file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        userContent.push({
          type: "file",
          file: { filename: file.name, file_data: file.url },
        });
      } else if (file.type?.startsWith("text/") || file.type === "application/json") {
        const decoded = decodeDataUrlText(file.url, MAX_TEXT_LENGTH);
        if (decoded) {
          userContent.push({ type: "text", text: `--- ${file.name} ---\n${decoded}` });
        }
      }
    }
  }

  if (userContent.length === 0) {
    return void res.status(400).json({ error: "No processable content provided" });
  }

  const messages: ChatMessage[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userContent.length === 1 && typeof userContent[0].text === "string" ? (userContent[0].text as string) : userContent },
  ];

  const data = await poeChatJson(apiKey, {
    model: modelToUse,
    messages,
    temperature: 0.8,
    max_tokens: 500,
  });

  const quote = getAssistantText(data!).trim();
  if (!quote) {
    throw new Error("No quote generated");
  }

  return void res.status(200).json({ quote });
});