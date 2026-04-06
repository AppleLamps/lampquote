/** Base URL for Vercel serverless routes. Empty = same origin (production). For local Vite + `vercel dev`, set VITE_API_BASE if ports differ. */
export function apiUrl(path: string): string {
  const base = (import.meta.env.VITE_API_BASE as string | undefined)?.replace(/\/$/, "") ?? "";
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export async function postJson<T>(path: string, body: unknown, signal?: AbortSignal): Promise<T> {
  const res = await fetch(apiUrl(path), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = typeof data?.error === "string" ? data.error : res.statusText;
    throw new Error(msg || `Request failed (${res.status})`);
  }
  return data as T;
}