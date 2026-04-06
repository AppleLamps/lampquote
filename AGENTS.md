# AGENTS.md — LampScribe Workspace Memory

## Learned User Preferences

- Do not remove supported file types without explicit user approval; add a warning instead of silently dropping them.
- No auth or login screen — the app is fully public with zero authentication gating; do not re-add any auth flow.
- ESLint: `react-refresh/only-export-components` is disabled for all files under `src/components/ui/**` (shadcn UI).
- Use `import` syntax (ESM) for `tailwindcss-animate` in config — never `require()`.
- `POE_API_KEY` is server-only; never prefix it with `VITE_`.
- Poe bot/model names in UI and API calls must match public Poe bot names exactly (see Poe API Notes below).

## Learned Workspace Facts

- **Project name**: LampScribe — a Vite 5 + React 18 + TypeScript SPA deployed on Vercel.
- **Tech stack**: shadcn/ui, Tailwind CSS 3, TanStack Query, React Router 6. No database, no auth provider, no cloud storage.
- **No authentication**: fully public app; `src/components/auth/` and `src/hooks/useAuth.ts` were deleted; do not recreate them.
- **Quote persistence**: `localStorage` key `lampscribe-quotes-v1`; cross-tab sync via custom `lampscribe-quotes-changed` window event.
- **AI backend**: Poe OpenAI-compatible API at `https://api.poe.com/v1`. Three Vercel serverless routes — `api/generate-quote.ts`, `api/generate-flux-prompt.ts`, `api/generate-image.ts` — share `lib/poe-server.ts`.
- **Vercel config**: `maxDuration` 300 s for `generate-image` (two sequential Poe calls); 60 s for the other two routes; SPA rewrite excludes `/api/*`. Vercel Pro required for `maxDuration > 60`.
- **Local dev**: `vercel dev` on port 3000 + `npm run dev` (Vite on 8080); Vite proxies `/api` → `http://127.0.0.1:3000`.
- **File attachments**: read client-side as base64 data URLs; 3 MB per-file cap (Vercel body limit 4.5 MB, base64 adds ~33% overhead).
- **Supported file types**: `image/*`, `.pdf`, `.doc`, `.docx`, `.txt`, `.md`.
- **`lovable-tagger`** has been removed from `package.json` devDeps and `vite.config.ts`; `supabase/` and `src/integrations/supabase/` directories are deleted.

---

## Architecture

| Concern | Implementation |
|---|---|
| Frontend | Vite 5 + React 18 + TypeScript |
| UI components | shadcn/ui + Tailwind CSS 3 |
| Data fetching | TanStack Query |
| Routing | React Router 6 |
| Persistence | `localStorage` only (no DB) |
| AI API | Poe OpenAI-compatible (`api.poe.com/v1`) |
| Hosting | Vercel (Pro tier for long timeouts) |

## Environment Variables

| Variable | Side | Purpose |
|---|---|---|
| `POE_API_KEY` | Server only | Poe API authentication — never expose to client |
| `POE_APP_URL` | Server only | Optional `HTTP-Referer` for Poe leaderboard attribution |
| `POE_IMAGE_PROMPT_MODEL` | Server only | Override prompt-optimizer model (default `Gemini-3-Pro`) |
| `VITE_API_BASE` | Client | Optional override for local dev when Vite and `vercel dev` use different ports |

## Poe API Notes

- API base: `https://api.poe.com/v1` (OpenAI-compatible format, not OpenAI).
- Model names must be **lowercase kebab-case** as shown on [poe.com/api/models](https://poe.com/api/models).
- Text models in use: `gemini-3-flash` (default), `gemini-3.1-pro`, `gemini-2.5-flash`, `gemini-2.5-pro`, `claude-sonnet-4.6`, `claude-opus-4.6`, `claude-haiku-4.5`, `gpt-5.4`, `gpt-5.4-mini`, `grok-4`
- Image models in use: `gpt-image-1.5` (default), `imagen-4`, `imagen-4-ultra`, `flux-pro-1.1`, `flux-2-pro`, `dall-e-3`, `flux-schnell`
- Prompt-optimizer model (image pipeline step 1): `gemini-3.1-pro` (override via `POE_IMAGE_PROMPT_MODEL`)
- Old Lovable gateway names (e.g. `google/gemini-3-flash-preview`) and old PascalCase names (e.g. `Gemini-3-Flash`, `Claude-Sonnet-4.6`) are invalid — always use the lowercase ID from the models page.

## File Handling

- Files are read client-side with `FileReader` and sent as base64 data URLs.
- Per-file size cap: **3 MB** (enforced client-side before upload).
- Content block mapping sent to Poe:
  - `image/*` → `type: "image_url"`
  - `.pdf`, `.doc`, `.docx` → `type: "file"` with `file_data`
  - `.txt`, `.md` → decoded server-side, inlined as `type: "text"`

## ESLint / Tooling

- `react-refresh/only-export-components` disabled for `src/components/ui/**`.
- `tailwindcss-animate` imported via ESM (`import`) in Tailwind config — not `require()`.
- `lovable-tagger` is removed; do not re-add it.
