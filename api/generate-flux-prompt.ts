import { poeChatJson, getAssistantText, withCorsAndAuth } from "../lib/poe-server";

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

  const modelToUse = model && ALLOWED_MODELS.includes(model) ? model : DEFAULT_MODEL;

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
    { role: "user" as const, content: `Idea to convert to Flux prompt: ${text.trim()}` },
  ];

  const data = await poeChatJson(apiKey, {
    model: modelToUse,
    messages,
    temperature: 0.7,
    max_tokens: 1500,
  });

  const generatedPrompt = getAssistantText(data!).trim();
  return void res.status(200).json({ prompt: generatedPrompt });
});