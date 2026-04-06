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

  let data: ReturnType<typeof JSON.parse> | null = null;
  try {
    data = await res.json();
  } catch {
    const text = await res.text().catch(() => "");
    throw new Error(`Poe API returned non-JSON (${res.status}): ${text.slice(0, 200)}`);
  }

  if (!res.ok) {
    const msg =
      data?.error?.message ||
      (typeof data?.message === "string" ? data.message : null) ||
      JSON.stringify(data).slice(0, 300);
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

/**
 * Remove model-generated thinking traces and citation markers from AI output.
 *
 * Strips:
 *  - `<think>…</think>` / `<thinking>…</thinking>` blocks (including multiline)
 *  - `<output>…</output>` wrapper tags (keeps inner content)
 *  - Inline citation markers: `[1]`, `[1, 2]`, `【1†source】`, etc.
 *  - Leftover leading/trailing whitespace
 */
export function stripAIArtifacts(text: string): string {
  let out = text;
  // Remove <think>…</think> and <thinking>…</thinking> blocks (separate patterns to avoid cross-matching)
  out = out.replace(/<think>[\s\S]*?<\/think>/gi, "");
  out = out.replace(/<thinking>[\s\S]*?<\/thinking>/gi, "");
  // Unwrap <output>…</output> wrapper (keep inner content)
  out = out.replace(/<output>([\s\S]*?)<\/output>/gi, "$1");
  // Remove bracketed citation markers like [1], [2, 3], [1][2]
  out = out.replace(/\[\d+(?:\s*,\s*\d+)*\]/g, "");
  // Remove lenticular bracket citations like 【1†source】 or 【2:3†file.pdf】
  out = out.replace(/【[^】]*】/g, "");
  return out.trim();
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

/* ── Shared CORS + method guard for all Vercel serverless routes ── */

import type { VercelRequest, VercelResponse } from "@vercel/node";

export function setCors(res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

/**
 * Wraps a POST handler with CORS headers, OPTIONS preflight, and method guard.
 * The inner handler is only called for valid POST requests with a confirmed API key.
 */
export function withCorsAndAuth(
  handler: (req: VercelRequest, res: VercelResponse, apiKey: string) => Promise<void>
) {
  return async (req: VercelRequest, res: VercelResponse) => {
    setCors(res);
    if (req.method === "OPTIONS") return res.status(204).end();
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    const apiKey = process.env.POE_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "POE_API_KEY is not configured on the server" });
    }

    try {
      await handler(req, res, apiKey);
    } catch (e: unknown) {
      const err = e as { status?: number; message?: string };
      const status = err.status && err.status >= 400 && err.status < 600 ? err.status : 500;
      const message = e instanceof Error ? e.message : "Internal server error";
      if (status === 429) {
        return res.status(429).json({ error: "Rate limit exceeded. Please wait a moment and try again." });
      }
      if (status === 402) {
        return res.status(402).json({ error: "Insufficient Poe points. Check your subscription or add-on points at poe.com." });
      }
      console.error("API error:", e);
      return res.status(status).json({ error: message });
    }
  };
}