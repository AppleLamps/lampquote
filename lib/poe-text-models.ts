/** Poe text/chat models: single source for quote, Grok Imagine prompt page, and image prompt-helper allowlists. */

export const POE_TEXT_MODEL_OPTIONS = [
  { value: "gemini-3-flash", label: "Gemini 3 Flash", description: "Fast & cheap" },
  { value: "gemini-3.1-pro", label: "Gemini 3.1 Pro", description: "Strong reasoning" },
  { value: "gemini-3.1-flash-lite", label: "Gemini 3.1 Flash Lite", description: "Lightweight & fast" },
  { value: "gemini-2.5-flash", label: "Gemini 2.5 Flash", description: "Balanced" },
  { value: "claude-sonnet-4.6", label: "Claude Sonnet 4.6", description: "Capable generalist" },
  { value: "claude-opus-4.6", label: "Claude Opus 4.6", description: "Highest quality" },
  { value: "gpt-5.4", label: "GPT-5.4", description: "OpenAI flagship" },
  { value: "glm-5", label: "GLM 5", description: "Zhipu" },
  { value: "kimi-k2.5", label: "Kimi K2.5", description: "Moonshot" },
  { value: "qwen3.6-plus", label: "Qwen 3.6 Plus", description: "Alibaba" },
  { value: "seed-2.0-pro", label: "Seed 2.0 Pro", description: "ByteDance" },
  { value: "grok-4.1-fast-reasoning", label: "Grok 4.1 Fast Reasoning", description: "xAI" },
  { value: "grok-4.20-multi-agent", label: "Grok 4.20 Multi-Agent", description: "xAI" },
] as const;

export const POE_TEXT_MODEL_IDS: string[] = POE_TEXT_MODEL_OPTIONS.map((m) => m.value);

export const DEFAULT_QUOTE_TEXT_MODEL = "gemini-3-flash";

/** Image pipeline prompt-optimizer default when env override is missing or not an allowed text model. */
export const DEFAULT_IMAGE_PROMPT_HELPER_MODEL = "gemini-3.1-pro";

export function resolveAllowedTextModel(model: string | undefined, fallback: string): string {
  return model && POE_TEXT_MODEL_IDS.includes(model) ? model : fallback;
}
