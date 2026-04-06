---
url: "https://creator.poe.com/docs/external-applications/claude-code"
title: "Claude Code | Poe Creator Platform"
---

# Claude Code

Copy for LLMView as Markdown

## [Quick Start](https://creator.poe.com/docs/external-applications/claude-code\#quick-start)

This guide will get you running [Claude Code](https://docs.anthropic.com/en/docs/claude-code/overview) powered by Poe in just a few minutes.

### [Step 1: Install Claude Code](https://creator.poe.com/docs/external-applications/claude-code\#step-1-install-claude-code)

Native Install (Recommended)npm

**macOS, Linux, WSL:**

```
curl -fsSL https://claude.ai/install.sh | bash
```

**Windows PowerShell:**

```
irm https://claude.ai/install.ps1 | iex
```

Requires [Node.js 18 or newer](https://nodejs.org/en/download/).

```
npm install -g @anthropic-ai/claude-code
```

### [Step 2: Connect Claude Code to Poe](https://creator.poe.com/docs/external-applications/claude-code\#step-2-connect-claude-code-to-poe)

Instead of logging in with Anthropic directly, connect Claude Code to Poe.
This requires setting a few environment variables.

Requirements:

1. Use `https://api.poe.com` for the base URL
2. Provide your Poe API key as the Anthropic API key
3. **Important:** This replaces the need for an Anthropic API key

```
# Set these in your shell (e.g., ~/.bashrc, ~/.zshrc)
export ANTHROPIC_BASE_URL="https://api.poe.com"
export ANTHROPIC_AUTH_TOKEN="$POE_API_KEY"
export ANTHROPIC_API_KEY="" # Important: Must be explicitly empty
```

**Persistence:** We recommend adding these lines to your shell profile (`~/.bashrc`, `~/.zshrc`, or `~/.config/fish/config.fish`).

**Note:** The native Claude Code installer does not read standard `.env` files, so environment variables must be set in your shell profile.

### [Step 3: Get Your Poe API Key](https://creator.poe.com/docs/external-applications/claude-code\#step-3-get-your-poe-api-key)

Navigate to [poe.com/api/keys](https://poe.com/api/keys) to get your API key.

### [Step 4: Start Your Session](https://creator.poe.com/docs/external-applications/claude-code\#step-4-start-your-session)

Navigate to your project directory and start Claude Code:

```
cd /path/to/your/project
claude
```

You are now connected! Any prompt you send will be routed through Poe.

### [Step 5: Verify](https://creator.poe.com/docs/external-applications/claude-code\#step-5-verify)

You can confirm your connection by running the `/status` command inside Claude Code.

```
> /status
Anthropic base URL: https://api.poe.com
```

## [Supported Models](https://creator.poe.com/docs/external-applications/claude-code\#supported-models)

You can use any Claude model available on Poe. Claude Code uses specific model aliases (like "Sonnet", "Opus", "Haiku") that automatically map to the correct Claude models.

| Alias | Model |
| --- | --- |
| Sonnet | Claude Sonnet 4.5 |
| Opus | Claude Opus 4.5 |
| Haiku | Claude Haiku 3.5 |

For a full list of available Claude models, see the [Anthropic Compatible API](https://creator.poe.com/docs/external-applications/anthropic-compatible-api#supported-models) documentation.

## [How It Works](https://creator.poe.com/docs/external-applications/claude-code\#how-it-works)

Poe exposes an endpoint that is compatible with the [Anthropic Messages API](https://creator.poe.com/docs/external-applications/anthropic-compatible-api).

1. **Direct Connection:** When you set `ANTHROPIC_BASE_URL` to `https://api.poe.com`, Claude Code speaks its native protocol directly to Poe. No local proxy server is required.
2. **API Compatibility:** Poe's Anthropic-compatible endpoint behaves like the Anthropic API. It handles model mapping and supports advanced features like extended thinking and native tool use.
3. **Billing:** You are billed using your Poe subscription points. Usage appears in your Poe account.

## [Troubleshooting](https://creator.poe.com/docs/external-applications/claude-code\#troubleshooting)

- **Auth Errors:** Ensure your `POE_API_KEY` environment variable is set correctly. You can verify by running `echo $POE_API_KEY` in your terminal.
- **Model Not Found:** Make sure you're using a supported Claude model. See the [supported models](https://creator.poe.com/docs/external-applications/claude-code#supported-models) section.
- **Rate Limits:** The API is rate-limited to 500 requests per minute. If you're hitting rate limits, consider adding delays between requests.
- **Setup Issues:** Use `/logout` first and then [set your credentials](https://creator.poe.com/docs/external-applications/claude-code#step-2-connect-claude-code-to-poe).

## [Pricing & Availability](https://creator.poe.com/docs/external-applications/claude-code\#pricing--availability)

All Poe subscribers can use their existing subscription points with the API at no additional cost.

This means you can seamlessly transition between the web interface and API without worrying about separate billing structures or additional fees. Your regular monthly point allocation works exactly the same way whether you're chatting directly on Poe or accessing Claude programmatically through Claude Code.

If your Poe subscription is not enough, you can [purchase add-on points](https://poe.com/api/keys) to get as much access as your application requires.

## [Support](https://creator.poe.com/docs/external-applications/claude-code\#support)

Feel free to [reach out to support](mailto:developers@poe.com) if you come across unexpected behavior or have suggestions for improvements.

On this page

[Quick Start](https://creator.poe.com/docs/external-applications/claude-code#quick-start) [Step 1: Install Claude Code](https://creator.poe.com/docs/external-applications/claude-code#step-1-install-claude-code) [Step 2: Connect Claude Code to Poe](https://creator.poe.com/docs/external-applications/claude-code#step-2-connect-claude-code-to-poe) [Step 3: Get Your Poe API Key](https://creator.poe.com/docs/external-applications/claude-code#step-3-get-your-poe-api-key) [Step 4: Start Your Session](https://creator.poe.com/docs/external-applications/claude-code#step-4-start-your-session) [Step 5: Verify](https://creator.poe.com/docs/external-applications/claude-code#step-5-verify) [Supported Models](https://creator.poe.com/docs/external-applications/claude-code#supported-models) [How It Works](https://creator.poe.com/docs/external-applications/claude-code#how-it-works) [Troubleshooting](https://creator.poe.com/docs/external-applications/claude-code#troubleshooting) [Pricing & Availability](https://creator.poe.com/docs/external-applications/claude-code#pricing--availability) [Support](https://creator.poe.com/docs/external-applications/claude-code#support)