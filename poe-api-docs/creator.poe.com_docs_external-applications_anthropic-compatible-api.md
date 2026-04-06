---
url: "https://creator.poe.com/docs/external-applications/anthropic-compatible-api"
title: "Anthropic Compatible API | Poe Creator Platform"
---

# Anthropic Compatible API

Copy for LLMView as Markdown

The Poe API provides access to Claude models through an Anthropic-compatible endpoint. Use your Poe API key to access Claude without needing a separate Anthropic API key.

**Key benefits:**

- Use your existing Poe subscription points with no additional setup
- Drop-in replacement for the Anthropic API - works with existing Anthropic SDK code
- Requests are proxied directly to the provider with minimal transformation

If you're already using the Anthropic SDK, you can switch to using Poe by simply changing the base URL and API key. For full API reference, see [Anthropic's official documentation](https://docs.anthropic.com/en/api/messages).

## [Claude Code](https://creator.poe.com/docs/external-applications/anthropic-compatible-api\#claude-code)

You can use the Poe API with Claude Code by setting two environment variables:

```
export ANTHROPIC_API_KEY=$POE_API_KEY
export ANTHROPIC_BASE_URL="https://api.poe.com"
```

You can then restart Claude Code and verify you're using the Poe API with the `/status` command.

## [Differences from our other APIs](https://creator.poe.com/docs/external-applications/anthropic-compatible-api\#differences-from-our-other-apis)

Only official Anthropic bots are supported through this API. You cannot call custom bots, or bots from other providers from this endpoint. If you would like to call other bots, please see our [external applications guide](https://creator.poe.com/docs/external-applications/external-application-guide) or our [OpenAI Compatible API](https://creator.poe.com/docs/external-applications/openai-compatible-api).

For the full API reference including request/response formats, message types, and tool use, see [Anthropic's official documentation](https://docs.anthropic.com/en/api/messages).

## [Getting Started](https://creator.poe.com/docs/external-applications/anthropic-compatible-api\#getting-started)

PythonNode.jscURL

```
# pip install anthropic
import os
import anthropic

client = anthropic.Anthropic(
    api_key=os.getenv("POE_API_KEY"),  # https://poe.com/api/keys
    base_url="https://api.poe.com",
)

message = client.messages.create(
    model="claude-sonnet-4.6",  # or claude-opus-4.6, claude-haiku-4.5, etc.
    max_tokens=1024,
    messages=[{"role": "user", "content": "What are the top 3 things to do in NYC?"}],
)
print(message.content[0].text)
```

```
// npm install @anthropic-ai/sdk
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
    apiKey: process.env.POE_API_KEY,  // https://poe.com/api/keys
    baseURL: "https://api.poe.com",
});

const message = await client.messages.create({
    model: "claude-sonnet-4.6",  // or claude-opus-4.6, claude-haiku-4.5, etc.
    max_tokens: 1024,
    messages: [{ role: "user", content: "What are the top 3 things to do in NYC?" }],
});

console.log(message.content[0].text);
```

```
curl "https://api.poe.com/v1/messages" \
    -H "Content-Type: application/json" \
    -H "x-api-key: $POE_API_KEY" \
    -H "anthropic-version: 2023-06-01" \
    -d '{
        "model": "claude-sonnet-4.6",
        "max_tokens": 1024,
        "messages": [\
            {\
                "role": "user",\
                "content": "What are the top 3 things to do in NYC?"\
            }\
        ]
    }'
```

## [Authentication](https://creator.poe.com/docs/external-applications/anthropic-compatible-api\#authentication)

The Poe Anthropic-compatible API supports two authentication methods:

### [x-api-key header (recommended)](https://creator.poe.com/docs/external-applications/anthropic-compatible-api\#x-api-key-header-recommended)

This is Anthropic's standard authentication method:

```
curl "https://api.poe.com/v1/messages" \
    -H "x-api-key: $POE_API_KEY" \
    -H "anthropic-version: 2023-06-01" \
    ...
```

### [Authorization: Bearer header](https://creator.poe.com/docs/external-applications/anthropic-compatible-api\#authorization-bearer-header)

For compatibility with tools that use Bearer token authentication:

```
curl "https://api.poe.com/v1/messages" \
    -H "Authorization: Bearer $POE_API_KEY" \
    -H "anthropic-version: 2023-06-01" \
    ...
```

If both headers are provided, `x-api-key` takes precedence.

Get your API key at [poe.com/api/keys](https://poe.com/api/keys).

## [Streaming](https://creator.poe.com/docs/external-applications/anthropic-compatible-api\#streaming)

You can stream responses by setting `stream: true`:

PythonNode.jscURL

```
import os
import anthropic

client = anthropic.Anthropic(
    api_key=os.getenv("POE_API_KEY"),
    base_url="https://api.poe.com",
)

with client.messages.stream(
    model="claude-sonnet-4.6",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Tell me about San Francisco"}],
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
```

```
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
    apiKey: process.env.POE_API_KEY,
    baseURL: "https://api.poe.com",
});

const stream = await client.messages.stream({
    model: "claude-sonnet-4.6",
    max_tokens: 1024,
    messages: [{ role: "user", content: "Tell me about San Francisco" }],
});

for await (const event of stream) {
    if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
        process.stdout.write(event.delta.text);
    }
}
```

```
curl "https://api.poe.com/v1/messages" \
    -H "Content-Type: application/json" \
    -H "x-api-key: $POE_API_KEY" \
    -H "anthropic-version: 2023-06-01" \
    -d '{
        "model": "claude-sonnet-4.6",
        "max_tokens": 1024,
        "stream": true,
        "messages": [\
            {\
                "role": "user",\
                "content": "Tell me about San Francisco"\
            }\
        ]
    }' \
    --no-buffer
```

## [Supported Models](https://creator.poe.com/docs/external-applications/anthropic-compatible-api\#supported-models)

You can use any Claude model available on Poe. You can use the bot name from poe or the Anthropic API model name.

| Model | Example name |
| --- | --- |
| Claude Sonnet 4.6 | `claude-sonnet-4.6` |
| Claude Opus 4.6 | `claude-opus-4.6` |
| Claude Haiku 4.5 | `claude-haiku-4.5` |

## [Rate Limits](https://creator.poe.com/docs/external-applications/anthropic-compatible-api\#rate-limits)

Our rate limit is **500 requests per minute** (rpm).

### [Rate Limit Headers](https://creator.poe.com/docs/external-applications/anthropic-compatible-api\#rate-limit-headers)

The following headers are included in responses:

| Header | Description |
| --- | --- |
| `x-ratelimit-limit-requests` | Maximum requests allowed per time window (500) |
| `x-ratelimit-remaining-requests` | Remaining requests in current time window |
| `x-ratelimit-reset-requests` | Seconds until the rate limit resets |

When rate limited, you'll receive an HTTP 429 response with an error of type `rate_limit_error`.

**Retry tips:**

- Use exponential back-off (starting at 250ms) with jitter
- Check the rate limit headers to avoid hitting limits

## [Error Handling](https://creator.poe.com/docs/external-applications/anthropic-compatible-api\#error-handling)

Errors follow the [Anthropic error format](https://docs.anthropic.com/en/api/errors). All errors return:

```
{
    "type": "error",
    "error": {
        "type": "authentication_error",
        "message": "Invalid API key"
    }
}
```

### [Streaming Errors](https://creator.poe.com/docs/external-applications/anthropic-compatible-api\#streaming-errors)

If an error occurs during streaming, an SSE error event is sent before the stream closes:

```
event: error
data: {"type": "error", "error": {"type": "api_error", "message": "An error occurred"}}
```

## [Migration Checklist (Anthropic → Poe)](https://creator.poe.com/docs/external-applications/anthropic-compatible-api\#migration-checklist-anthropic--poe)

1. **Swap base URL:**`https://api.anthropic.com` → `https://api.poe.com`
2. **Replace API key:**`ANTHROPIC_API_KEY` → `POE_API_KEY`
3. **Run your code** \- Everything else should work the same!

## [Pricing & Availability](https://creator.poe.com/docs/external-applications/anthropic-compatible-api\#pricing--availability)

All Poe subscribers can use their existing subscription points with the API at no additional cost.

This means you can seamlessly transition between the web interface and API without worrying about separate billing structures or additional fees. Your regular monthly point allocation works exactly the same way whether you're chatting directly on Poe or accessing Claude programmatically through the API.

If your Poe subscription is not enough, you can [purchase add-on points](https://poe.com/api/keys) to get as much access as your application requires. Any add-on points you purchase can be used with any model or bot on Poe.

## [Support](https://creator.poe.com/docs/external-applications/anthropic-compatible-api\#support)

Feel free to [reach out to support](mailto:developers@poe.com) if you come across unexpected behavior or have suggestions for improvements.

On this page

[Claude Code](https://creator.poe.com/docs/external-applications/anthropic-compatible-api#claude-code) [Differences from our other APIs](https://creator.poe.com/docs/external-applications/anthropic-compatible-api#differences-from-our-other-apis) [Getting Started](https://creator.poe.com/docs/external-applications/anthropic-compatible-api#getting-started) [Authentication](https://creator.poe.com/docs/external-applications/anthropic-compatible-api#authentication) [x-api-key header (recommended)](https://creator.poe.com/docs/external-applications/anthropic-compatible-api#x-api-key-header-recommended) [Authorization: Bearer header](https://creator.poe.com/docs/external-applications/anthropic-compatible-api#authorization-bearer-header) [Streaming](https://creator.poe.com/docs/external-applications/anthropic-compatible-api#streaming) [Supported Models](https://creator.poe.com/docs/external-applications/anthropic-compatible-api#supported-models) [Rate Limits](https://creator.poe.com/docs/external-applications/anthropic-compatible-api#rate-limits) [Rate Limit Headers](https://creator.poe.com/docs/external-applications/anthropic-compatible-api#rate-limit-headers) [Error Handling](https://creator.poe.com/docs/external-applications/anthropic-compatible-api#error-handling) [Streaming Errors](https://creator.poe.com/docs/external-applications/anthropic-compatible-api#streaming-errors) [Migration Checklist (Anthropic → Poe)](https://creator.poe.com/docs/external-applications/anthropic-compatible-api#migration-checklist-anthropic--poe) [Pricing & Availability](https://creator.poe.com/docs/external-applications/anthropic-compatible-api#pricing--availability) [Support](https://creator.poe.com/docs/external-applications/anthropic-compatible-api#support)