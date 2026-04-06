/** Shared Poe OpenAI-compatible client for Vercel serverless routes only. */

const POE_BASE = "https://api.poe.com/v1";

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string | Record<string, unknown>[];
};

export async function poeChatCompletion(
  apiKey: string,
  body: Record<string, unknown>
): Promise<Response> {
  const referer = process.env.POE_APP_URL || "https://localhost";
  const payload = { stream: false, ...body };

  return fetch(`${POE_BASE}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": referer,
      "X-Title": "LampScribe",
    },
    body: JSON.stringify(payload),
  });
}

export async function poeChatJson(
  apiKey: string,
  body: Record<string, unknown>
): Promise<{
  choices?: Array<{
    message?: {
      content?: string | unknown[];
      images?: Array<{ image_url?: { url?: string } }>;
    };
    finish_reason?: string;
  }>;
  error?: { message?: string; code?: number };
} | null> {
  const res = await poeChatCompletion(apiKey, body);
  const text = await res.text();
  let data: ReturnType<typeof JSON.parse> | null = null;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`Poe API returned non-JSON (${res.status}): ${text.slice(0, 200)}`);
  }
  if (!res.ok) {
    const msg =
      data?.error?.message ||
      (typeof data?.message === "string" ? data.message : null) ||
      text.slice(0, 300);
    const err = new Error(msg) as Error & { status?: number };
    err.status = res.status;
    throw err;
  }
  return data;
}

export function getAssistantText(data: {
  choices?: Array<{ message?: { content?: string | unknown[] } }>;
}): string {
  const content = data.choices?.[0]?.message?.content;
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    const parts: string[] = [];
    for (const part of content) {
      if (typeof part === "object" && part && "text" in part) {
        parts.push(String((part as { text?: string }).text || ""));
      }
    }
    return parts.join("\n");
  }
  return "";
}

/** Poe image bots often return markdown ![](url) or a hosted URL in message content. */
export function extractImageUrlFromAssistant(data: {
  choices?: Array<{
    message?: {
      content?: string | unknown[];
      images?: Array<{ image_url?: { url?: string } }>;
    };
    finish_reason?: string;
  }>;
}): { imageUrl: string | null; text: string; finishReason?: string } {
  const choice = data.choices?.[0];
  const finishReason = choice?.finish_reason;
  const msg = choice?.message;

  const lovableStyle = msg?.images?.[0]?.image_url?.url;
  if (lovableStyle) return { imageUrl: lovableStyle, text: getAssistantText(data), finishReason };

  if (Array.isArray(msg?.content)) {
    for (const part of msg!.content as unknown[]) {
      if (typeof part === "object" && part && "type" in part) {
        const p = part as { type?: string; image_url?: { url?: string } };
        if (p.type === "image_url" && p.image_url?.url) {
          return { imageUrl: p.image_url.url, text: getAssistantText(data), finishReason };
        }
      }
    }
  }

  const raw = getAssistantText(data).trim();
  if (!raw) return { imageUrl: null, text: "", finishReason };

  const md = raw.match(/!\[[^\]]*\]\((https?:[^)\s]+)\)/);
  if (md) return { imageUrl: md[1], text: raw, finishReason };

  const urlMatch = raw.match(/https:\/\/[^\s)\]"']+\.(?:png|jpg|jpeg|webp|gif)(?:\?[^\s)\]"']*)?/i);
  if (urlMatch) return { imageUrl: urlMatch[0], text: raw, finishReason };

  if (raw.startsWith("data:image/")) return { imageUrl: raw, text: raw, finishReason };

  if (/^https:\/\//i.test(raw)) return { imageUrl: raw, text: raw, finishReason };

  return { imageUrl: null, text: raw, finishReason };
}

export function parseDataUrl(dataUrl: string): { mime: string; base64: string } | null {
  const m = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!m) return null;
  return { mime: m[1], base64: m[2] };
}

export function decodeDataUrlText(dataUrl: string, maxLen: number): string | null {
  const parsed = parseDataUrl(dataUrl);
  if (!parsed) return null;
  if (!parsed.mime.startsWith("text/") && parsed.mime !== "application/json") return null;
  try {
    const buf = Buffer.from(parsed.base64, "base64");
    return buf.toString("utf8").slice(0, maxLen);
  } catch {
    return null;
  }
}
