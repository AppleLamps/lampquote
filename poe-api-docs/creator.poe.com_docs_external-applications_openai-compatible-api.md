---
url: "https://creator.poe.com/docs/external-applications/openai-compatible-api"
title: "OpenAI Compatible API | Poe Creator Platform"
---

# OpenAI Compatible API

Copy for LLMView as Markdown

The Poe API provides access to hundreds of AI models and bots through a single OpenAI-compatible endpoint. Switch between frontier models from all major labs, open-source models, and millions of community-created bots using the same familiar interface.

**Key benefits:**

- Use your existing Poe subscription points with no additional setup
- Access models across all modalities: text, image, video, and audio generation
- OpenAI-compatible interface works with existing tools like [Cursor, Cline, Continue, and more](https://creator.poe.com/docs/external-applications/interface-configuration)
- Single API key for hundreds of models instead of managing multiple provider keys

If you're already using the OpenAI libraries, you can use this API as a low-cost way to switch between calling OpenAI models and Poe hosted models/bots to compare output, cost, and scalability, without changing your existing code.

> The Poe API supports both the **Chat Completions** (`/v1/chat/completions`) and **Responses** (`/v1/responses`) API formats. Chat Completions is simpler and widely compatible; the Responses API adds reasoning, web search, structured outputs, and multi-turn conversations. See [Responses API features](https://creator.poe.com/docs/external-applications/openai-compatible-api#responses-api) below.

## [Chat Completions API](https://creator.poe.com/docs/external-applications/openai-compatible-api\#chat-completions-api)

PythonNode.jscURL

```
# pip install openai
import os, openai

client = openai.OpenAI(
    api_key=os.getenv("POE_API_KEY"), # https://poe.com/api/keys
    base_url="https://api.poe.com/v1",
)

chat = client.chat.completions.create(
    model="Claude-Opus-4.6",  # or other models (Claude-Sonnet-4.6, Gemini-3-Pro, Llama-3.1-405B, Grok-4..)
    messages=[{"role": "user", "content": "Top 3 things to do in NYC?"}],
)
print(chat.choices[0].message.content)
```

```
// npm install openai
import OpenAI from "openai";

const client = new OpenAI({
    apiKey: "your_poe_api_key", // https://poe.com/api/keys
    baseURL: "https://api.poe.com/v1",
});

const completion = await client.chat.completions.create({
    model: "Grok-4", // or other models (Claude-Sonnet-4.6, Gemini-3-Pro, GPT-Image-1.5, Veo-3.1..)
    messages: [\
        {\
            role: "system",\
            content:\
                "You are Grok, a highly intelligent, helpful AI assistant.",\
        },\
        {\
            role: "user",\
            content:\
                "What is the meaning of life, the universe, and everything?",\
        },\
    ],
});

console.log(completion.choices[0].message.content);
```

```
curl "https://api.poe.com/v1/chat/completions" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $POE_API_KEY" \
    -d '{
        "model": "Claude-Sonnet-4.6",
        "messages": [\
            {\
                "role": "user",\
                "content": "Write a one-sentence bedtime story about a unicorn."\
            }\
        ]
    }'
```

## [Responses API](https://creator.poe.com/docs/external-applications/openai-compatible-api\#responses-api)

The Poe API also supports the [OpenAI Responses API](https://platform.openai.com/docs/api-reference/responses) format (`POST /v1/responses`), providing advanced capabilities beyond Chat Completions.

**Key benefits over Chat Completions:**

- Built-in reasoning and extended thinking support via `reasoning`
- Web search as a built-in tool (`web_search_preview`)
- Structured outputs with JSON schema via `text.format`
- Multi-turn conversations via `previous_response_id` (no need to resend full message history)

For full endpoint details, see the [API Reference](https://creator.poe.com/api-reference/createResponse).

### [Basic Usage](https://creator.poe.com/docs/external-applications/openai-compatible-api\#basic-usage)

PythonNode.jscURL

```
import os, openai

client = openai.OpenAI(
    api_key=os.getenv("POE_API_KEY"),
    base_url="https://api.poe.com/v1",
)

response = client.responses.create(
    model="Claude-Sonnet-4.6",
    input="What are the top 3 things to do in NYC?",
)

print(response.output_text)
```

```
import OpenAI from "openai";

const client = new OpenAI({
    apiKey: process.env.POE_API_KEY,
    baseURL: "https://api.poe.com/v1",
});

const response = await client.responses.create({
    model: "Claude-Sonnet-4.6",
    input: "What are the top 3 things to do in NYC?",
});

console.log(response.output_text);
```

```
curl "https://api.poe.com/v1/responses" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $POE_API_KEY" \
    -d '{
        "model": "Claude-Sonnet-4.6",
        "input": "What are the top 3 things to do in NYC?"
    }'
```

### [Reasoning](https://creator.poe.com/docs/external-applications/openai-compatible-api\#reasoning)

Enable extended thinking for complex tasks:

PythoncURL

```
response = client.responses.create(
    model="Claude-Sonnet-4.6",
    input="Solve step by step: if a train leaves at 3pm going 60mph and another at 4pm going 90mph, when do they meet?",
    reasoning={"effort": "high", "summary": "auto"},
)
print(response.output_text)
```

```
curl "https://api.poe.com/v1/responses" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $POE_API_KEY" \
    -d '{
        "model": "Claude-Sonnet-4.6",
        "input": "Solve step by step: ...",
        "reasoning": {"effort": "high", "summary": "auto"}
    }'
```

> **Note:** Not all models support reasoning. Models with built-in thinking capabilities (such as Claude Sonnet 4.6, o3, o4-mini) work best.

### [Web Search](https://creator.poe.com/docs/external-applications/openai-compatible-api\#web-search)

Use the built-in `web_search_preview` tool for up-to-date information:

PythoncURL

```
response = client.responses.create(
    model="GPT-5.4",
    input="What are the latest AI news today?",
    tools=[{"type": "web_search_preview"}],
)
print(response.output_text)
```

```
curl "https://api.poe.com/v1/responses" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $POE_API_KEY" \
    -d '{
        "model": "GPT-5.4",
        "input": "What are the latest AI news today?",
        "tools": [{"type": "web_search_preview"}]
    }'
```

### [Structured Outputs](https://creator.poe.com/docs/external-applications/openai-compatible-api\#structured-outputs)

Get responses in a specific JSON schema format:

```
response = client.responses.create(
    model="GPT-5.4",
    input="List the top 3 programming languages in 2025",
    text={
        "format": {
            "type": "json_schema",
            "name": "languages",
            "schema": {
                "type": "object",
                "properties": {
                    "languages": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "name": {"type": "string"},
                                "reason": {"type": "string"},
                            },
                            "required": ["name", "reason"],
                        },
                    }
                },
                "required": ["languages"],
            },
        }
    },
)
print(response.output_text)
```

### [Multi-turn Conversations](https://creator.poe.com/docs/external-applications/openai-compatible-api\#multi-turn-conversations)

Use `previous_response_id` to continue a conversation without resending the full message history:

```
# First message
response = client.responses.create(
    model="Claude-Sonnet-4.6",
    input="What is the capital of France?",
)

# Follow-up using previous_response_id
followup = client.responses.create(
    model="Claude-Sonnet-4.6",
    input="What is its population?",
    previous_response_id=response.id,
)
print(followup.output_text)
```

### [Migration from Chat Completions](https://creator.poe.com/docs/external-applications/openai-compatible-api\#migration-from-chat-completions)

| Chat Completions | Responses API |
| --- | --- |
| `client.chat.completions.create()` | `client.responses.create()` |
| `POST /v1/chat/completions` | `POST /v1/responses` |
| `messages: [{"role": "user", "content": "..."}]` | `input: "..."` |
| `response.choices[0].message.content` | `response.output_text` |
| `extra_body={"reasoning_effort": "high"}` | `reasoning={"effort": "high"}` |
| N/A | `tools=[{"type": "web_search_preview"}]` |
| N/A | `previous_response_id=response.id` |
| N/A | `text={"format": {"type": "json_schema", ...}}` |

## [Known Issues & Limitations](https://creator.poe.com/docs/external-applications/openai-compatible-api\#known-issues--limitations)

### [Bot Availability](https://creator.poe.com/docs/external-applications/openai-compatible-api\#bot-availability)

- **Private bots are not currently supported** \- Only public bots can be accessed through the API
- **The App-Creator and Script-Bot-Creator bots are not available** via the OpenAI-compatible API endpoint (or via the Poe Python library)

### [Media Bot Recommendations](https://creator.poe.com/docs/external-applications/openai-compatible-api\#media-bot-recommendations)

- **Image, video, and audio bots** should be called with `stream=False` for optimal performance and reliability

### [Parameter Handling](https://creator.poe.com/docs/external-applications/openai-compatible-api\#parameter-handling)

- **Best-effort parameter passing** \- We make our best attempts to pass down parameters where possible, but some model-specific parameters may not be fully supported across all bots
- **Custom parameters (aspect, size, etc.)** \- You can pass custom bot parameters through the OpenAI SDK using the `extra_body` parameter. For example: `extra_body={"aspect": "1280x720"}` for Sora-2.

### [Additional Considerations](https://creator.poe.com/docs/external-applications/openai-compatible-api\#additional-considerations)

- Some community bots may have varying response formats or capabilities compared to standard language models

### [API behavior](https://creator.poe.com/docs/external-applications/openai-compatible-api\#api-behavior)

Here are the most substantial differences from using OpenAI:

- **Structured outputs are not supported** \- The `response_format` parameter with `type: "json_schema"` is not supported at this time.
- The **`strict`** parameter for function calling is ignored, which means the tool use JSON is not guaranteed to follow the supplied schema.
- Audio input is not supported; it will simply be ignored and stripped from input
- Most unsupported fields are silently ignored rather than producing errors. These are all documented below.

## [Detailed OpenAI Compatible API Support](https://creator.poe.com/docs/external-applications/openai-compatible-api\#detailed-openai-compatible-api-support)

### [Request fields](https://creator.poe.com/docs/external-applications/openai-compatible-api\#request-fields)

| **Field** | **Support status** |
| --- | --- |
| **`model`** | Use Poe bot names (Note: Poe UI-specific system prompts are skipped) |
| **`max_tokens`** | Fully supported |
| **`max_completion_tokens`** | Fully supported |
| **`stream`** | Fully supported |
| **`stream_options`** | Fully supported |
| **`top_p`** | Fully supported |
| **`tools`** | Fully Supported |
| **`tool_choice`** | Fully Supported |
| **`parallel_tool_calls`** | Fully Supported |
| **`stop`** | All non-whitespace stop sequences work |
| **`temperature`** | Between 0 and 2 (inclusive). |
| **`n`** | Must be exactly 1 |
| **`logprobs`** | Fully supported |
| **`store`** | Ignored |
| **`metadata`** | Ignored |
| **`response_format`** | Ignored |
| **`prediction`** | Ignored |
| **`presence_penalty`** | Ignored |
| **`frequency_penalty`** | Ignored |
| **`seed`** | Ignored |
| **`service_tier`** | Ignored |
| **`audio`** | Ignored |
| **`logit_bias`** | Ignored |
| **`user`** | Ignored |
| **`modalities`** | Ignored |
| **`top_logprobs`** | Fully supported |
| **`reasoning_effort`** | Ignored (use `extra_body` instead) |
| **`extra_body`** | Fully supported - use to pass custom bot parameters like `reasoning_effort`, `thinking_budget`, etc. |

### [Response fields](https://creator.poe.com/docs/external-applications/openai-compatible-api\#response-fields)

| **Field** | **Support status** |
| --- | --- |
| **`id`** | Fully supported |
| **`choices[]`** | Will always have a length of 1 |
| **`choices[].finish_reason`** | Fully supported |
| **`choices[].index`** | Fully supported |
| **`choices[].message.role`** | Fully supported |
| **`choices[].message.content`** | Fully supported |
| **`choices[].message.tool_calls`** | Fully supported |
| **`object`** | Fully supported |
| **`created`** | Fully supported |
| **`model`** | Fully supported |
| **`finish_reason`** | Fully supported |
| **`content`** | Fully supported |
| **`usage.completion_tokens`** | Fully supported |
| **`usage.prompt_tokens`** | Fully supported |
| **`usage.total_tokens`** | Fully supported |
| **`usage.completion_tokens_details`** | Always empty |
| **`usage.prompt_tokens_details`** | Always empty |
| **`choices[].message.refusal`** | Always empty |
| **`choices[].message.audio`** | Always empty |
| **`logprobs`** | Always empty |
| **`service_tier`** | Always empty |
| **`system_fingerprint`** | Always empty |

### [Error message compatibility](https://creator.poe.com/docs/external-applications/openai-compatible-api\#error-message-compatibility)

The compatibility layer maintains consistent error formats with the OpenAI API. However, the detailed error messages may not be equivalent. We recommend only using the error messages for logging and debugging.

All errors return:

```
{
  "error": {
    "code": 401,
    "type": "authentication_error",
    "message": "Invalid API key",
    "metadata": {...}
  }
}
```

| HTTP / `code` | `type` | When it happens |
| --- | --- | --- |
| **400** | `invalid_request_error` | malformed JSON, missing fields |
| **401** | `authentication_error` | bad/expired key |
| **402** | `insufficient_credits` | balance ≤ 0 |
| **403** | `moderation_error` | permission denied or authorization issues |
| **404** | `not_found_error` | wrong endpoint / model |
| **408** | `timeout_error` | model didn't start in a reasonable time |
| **413** | `request_too_large` | tokens > context window |
| **429** | `rate_limit_error` | rpm/tpm cap hit |
| **500** | `provider_error` | provider-side issues, or invalid requests |
| **502** | `upstream_error` | model backend not working |
| **529** | `overloaded_error` | transient traffic spike |

**Retry tips**

- Respect `Retry-After` header on 429/503.
- Exponential back‑off (starting at 250 ms) plus jitter works well.
- Idempotency: resubmit the exact same payload to safely retry.

### [Header compatibility](https://creator.poe.com/docs/external-applications/openai-compatible-api\#header-compatibility)

While the OpenAI SDK automatically manages headers, here is the complete list of headers supported by Poe's API for developers who need to work with them directly.

Response Headers:

| **Header** | **Definition** | **Support Status** |
| --- | --- | --- |
| **`openai-organization`** | OpenAI org | Unsupported |
| **`openai-processing-ms`** | Time taken processing your API request | Supported |
| **`openai-version`** | REST API version ( **`2020-10-01`)** | Supported |
| **`x-request-id`** | Unique identifier for this API request (troubleshooting) | Supported |

**Rate Limit Headers**

Our rate limit is 500 requests per minute (rpm). We support request-based rate limit headers but do not support token-based rate limiting:

**Supported (Request-based):**

- `x-ratelimit-limit-requests` \- Maximum requests allowed per time window (500)
- `x-ratelimit-remaining-requests` \- Remaining requests in current time window
- `x-ratelimit-reset-requests` \- Seconds until the rate limit resets

**Not Supported (Token-based):**

- `x-ratelimit-limit-tokens` \- Not applicable (Poe does not use token-based rate limiting)
- `x-ratelimit-remaining-tokens` \- Not applicable
- `x-ratelimit-reset-tokens` \- Not applicable

## [Getting Started](https://creator.poe.com/docs/external-applications/openai-compatible-api\#getting-started)

PythonNode.jscURL

```
# pip install openai
import os
import openai

client = openai.OpenAI(
  api_key=os.environ.get("POE_API_KEY"),
  base_url="https://api.poe.com/v1",
)
completion = client.chat.completions.create(
  model="gemini-3-pro",  # or other models (Claude-Sonnet-4.6, GPT-5.4, Llama-3.1-405B, Grok-4..)
  messages=[{"role": "user", "content": "What are the top 3 things to do in New York?"}],
)

print(completion.choices[0].message.content)
```

```
// npm install openai
import OpenAI from "openai";

const client = new OpenAI({
    apiKey: process.env.POE_API_KEY,
    baseURL: "https://api.poe.com/v1",
});

const completion = await client.chat.completions.create({
    model: "Claude-Sonnet-4.6", // or other models (Gemini-3-Pro, GPT-Image-1.5, Veo-3.1, Grok-4..)
    messages: [\
        {\
            role: "user",\
            content: "What are the top 3 things to do in New York?",\
        },\
    ],
});

console.log(completion.choices[0].message.content);
```

```
curl "https://api.poe.com/v1/chat/completions" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $POE_API_KEY" \
    -d '{
        "model": "Grok-4",
        "messages": [\
            {\
                "role": "user",\
                "content": "What are the top 3 things to do in New York?"\
            }\
        ]
    }'
```

## [Streaming](https://creator.poe.com/docs/external-applications/openai-compatible-api\#streaming)

You can also use OpenAI's streaming capabilities to stream back your response:

PythonNode.jscURL

```
# pip install openai
import os
import openai

client = openai.OpenAI(
  api_key=os.environ.get("POE_API_KEY"),
  base_url="https://api.poe.com/v1",
)

stream = client.chat.completions.create(
  model="Claude-Sonnet-4.6",  # or other models (Gemini-3-Pro, GPT-Image-1.5, Veo-3.1, Grok-4..)
  messages=[\
    {"role": "system", "content": "You are a travel agent. Be descriptive and helpful."},\
    {"role": "user", "content": "Tell me about San Francisco"},\
  ],
  stream=True,
)

for chunk in stream:
	print(chunk.choices[0].delta.content or "", end="", flush=True)
```

```
// npm install openai
import OpenAI from "openai";

const client = new OpenAI({
    apiKey: process.env.POE_API_KEY,
    baseURL: "https://api.poe.com/v1",
});

const stream = await client.chat.completions.create({
    model: "Gemini-3-Pro", // or other models (Claude-Sonnet-4.6, GPT-Image-1.5, Veo-3.1, Llama-3.1-405B..)
    messages: [\
        {\
            role: "system",\
            content: "You are a travel agent. Be descriptive and helpful.",\
        },\
        {\
            role: "user",\
            content: "Tell me about San Francisco",\
        },\
    ],
    stream: true,
});

for await (const chunk of stream) {
    process.stdout.write(chunk.choices[0]?.delta?.content || "");
}
```

```
curl "https://api.poe.com/v1/chat/completions" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $POE_API_KEY" \
    -d '{
        "model": "GPT-5.4",
        "messages": [\
            {\
                "role": "system",\
                "content": "You are a travel agent. Be descriptive and helpful."\
            },\
            {\
                "role": "user",\
                "content": "Tell me about San Francisco"\
            }\
        ],
        "stream": true
    }' \
    --no-buffer
```

## [File Inputs](https://creator.poe.com/docs/external-applications/openai-compatible-api\#file-inputs)

You can also pass in files using base64-encoded data URLs:

PythonNode.jscURL

```
# pip install openai
import os
import openai

client = openai.OpenAI(
  api_key=os.environ.get("POE_API_KEY"),
  base_url="https://api.poe.com/v1",
)

with open("test_pdf.pdf", "rb") as f:
    base64_pdf = base64.b64encode(f.read()).decode("utf-8")

with open("test_image.jpeg", "rb") as f:
    base64_image = base64.b64encode(f.read()).decode("utf-8")

with open("test_audio.mp3", "rb") as f:
    base64_audio = base64.b64encode(f.read()).decode("utf-8")

with open("test_video.mp4", "rb") as f:
    base64_video = base64.b64encode(f.read()).decode("utf-8")

stream = client.chat.completions.create(
  model="Claude-Sonnet-4.6",  # or other models
  messages=[\
    {\
        "role": "user",\
        "content": [\
            {\
                "type": "text",\
                "text": "Please describe these attachments."\
            },\
            {\
                "type": "image_url",\
                "image_url": {\
                    "url": f"data:image/jpg;base64,{base64_image}"\
                }\
            },\
            {\
                "type": "file",\
                "file": {\
                    "filename": "test_guide.pdf",\
                    "file_data": f"data:application/pdf;base64,{base64_pdf}"\
                }\
            },\
            {\
                "type": "file",\
                "file": {\
                    "filename": "test_audio.mp3",\
                    "file_data": f"data:audio/mp3;base64,{base64_audio}"\
                }\
            },\
            {\
                "type": "file",\
                "file": {\
                    "filename": "test_video.mp3",\
                    "file_data": f"data:video77/mp4;base64,{base64_video}"\
                }\
            }\
        ]\
    }\
  ],
  stream=True,
)

for chunk in stream:
	print(chunk.choices[0].delta.content or "", end="", flush=True)
```

```
import fs from "fs";
import path from "path";
import { OpenAI } from "openai";

const client = new OpenAI({
    apiKey: process.env.POE_API_KEY,
    baseURL: "https://api.poe.com/v1",
});

const base64_pdf = fs.readFileSync(path.resolve("test_pdf.pdf"), { encoding: "base64" });
const base64_image = fs.readFileSync(path.resolve("test_image.jpeg"), { encoding: "base64" });
const base64_audio = fs.readFileSync(path.resolve("test_audio.mp3"), { encoding: "base64" });

const stream = await client.chat.completions.create({
    model: "Claude-Sonnet-4.6", // or other models
    messages: [\
        {\
            role: "user",\
            content: [\
                {\
                    "type": "text",\
                    "text": "Please describe these attachments."\
                },\
                {\
                    "type": "image_url",\
                    "image_url": {\
                        "url": `data:image/jpg;base64,${base64_image}`\
                    }\
                },\
                {\
                    "type": "file",\
                    "file": {\
                        "filename": "test_guide.pdf",\
                        "file_data": `data:application/pdf;base64,${base64_pdf}`\
                    }\
                },\
                {\
                    "type": "file",\
                    "file": {\
                        "filename": "test_audio.mp3",\
                        "file_data": `data:audio/mp3;base64,${base64_audio}`\
                    }\
                },\
                {\
                    "type": "file",\
                    "file": {\
                        "filename": "test_video.mp3",\
                        "file_data": `data:video/mp4;base64,${base64_video}`\
                    }\
                }\
            ]\
        },\
    ],
    stream: true,
});

for await (const chunk of stream) {
    process.stdout.write(chunk.choices[0].delta.content || "");
}
```

```
curl "https://api.poe.com/v1/chat/completions" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $POE_API_KEY" \
    -d '{
        "model": "Claude-Sonnet-4.6",
        "messages": [\
            {\
                "role": "user",\
                "content": [\
                    {\
                        "type": "text",\
                        "text": "Please describe these attachments."\
                    },\
                    {\
                        "type": "image_url",\
                        "image_url": {\
                            "url": "...base64 encoded url here..."\
                        }\
                    },\
                    {\
                        "type": "file",\
                        "file": {\
                            "filename": "test_guide.pdf",\
                            "file_data": "...base64 encoded url here..."\
                        }\
                    },\
                    {\
                        "type": "file",\
                        "file": {\
                            "filename": "test_audio.mp3",\
                            "file_data": "...base64 encoded url here..."\
                        }\
                    },\
                    {\
                        "type": "file",\
                        "file": {\
                            "filename": "test_video.mp3",\
                            "file_data": "...base64 encoded url here..."\
                        }\
                    }\
                ]\
            }\
        ],
        "stream": true
    }' \
    --no-buffer
```

Additionally, Poe accepts image input files that are hosted on publicly accessible URLs.

PythonNode.jscURL

```
# pip install openai
import openai

client = openai.OpenAI(
  api_key=os.environ.get("POE_API_KEY"),
  base_url="https://api.poe.com/v1",
)

stream = client.chat.completions.create(
  model="GPT-5.4",  # or other models
  messages=[\
    {\
        "role": "user",\
        "content": [\
            {\
                "type": "text",\
                "text": "Please describe these attachments."\
            },\
            {\
                "type": "image_url",\
                "image_url": {\
                    "url": "https://psc2.cf2.poecdn.net/assets/_next/static/media/poeFullMultibot.aa56caf5.svg"\
                }\
            }\
        ]\
    }\
  ],
  stream=True,
)

for chunk in stream:
	print(chunk.choices[0].delta.content or "", end="", flush=True)
```

```
import { OpenAI } from "openai";

const client = new OpenAI({
    apiKey: process.env.POE_API_KEY,
    baseURL: "https://api.poe.com/v1",
});

const stream = await client.chat.completions.create({
    model: "GPT-5.4", // or other models
    messages: [\
        {\
            role: "user",\
            content: [\
                {\
                    "type": "text",\
                    "text": "Please describe these attachments."\
                },\
                {\
                    "type": "image_url",\
                    "image_url": {\
                        "url": "https://psc2.cf2.poecdn.net/assets/_next/static/media/poeFullMultibot.aa56caf5.svg"\
                    }\
                }\
            ]\
        },\
    ],
    stream: true,
});

for await (const chunk of stream) {
    process.stdout.write(chunk.choices[0].delta.content || "");
}
```

```
curl "https://api.poe.com/v1/chat/completions" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $POE_API_KEY" \
    -d '{
        "model": "GPT-5.4",
        "messages": [\
            {\
                "role": "user",\
                "content": [\
                    {\
                        "type": "text",\
                        "text": "Please describe these attachments."\
                    },\
                    {\
                        "type": "image_url",\
                        "image_url": {\
                            "url": "https://psc2.cf2.poecdn.net/assets/_next/static/media/poeFullMultibot.aa56caf5.svg"\
                        }\
                    }\
                ]\
            }\
        ],
        "stream": true
    }' \
    --no-buffer
```

## [Migration checklist (OpenAI → Poe in 60 s)](https://creator.poe.com/docs/external-applications/openai-compatible-api\#migration-checklist-openai--poe-in-60-s)

1. Swap base URL - `https://api.openai.com/v1` → `https://api.poe.com/v1`
2. Replace key env var - `OPENAI_API_KEY` → `POE_API_KEY`
3. Select the model/bot you want to use e.g. `Claude-Opus-4.6`
4. Delete any `n > 1`, audio, or `parallel_tool_calls` params.
5. Run tests - output should match except for intentional gaps above.

## [Pricing & Availability](https://creator.poe.com/docs/external-applications/openai-compatible-api\#pricing--availability)

All Poe subscribers can use their existing subscription points with the API at no additional cost.

This means you can seamlessly transition between the web interface and API without worrying about separate billing structures or additional fees. Your regular monthly point allocation works exactly the same way whether you're chatting directly on Poe or accessing bots programmatically through the API.

If your Poe subscription is not enough, you can now [purchase add-on points](https://poe.com/api/keys) to get as much access as your application requires. Our intent in pricing these points is to charge the same amount for model access that underlying model providers charge. Any add-on points you purchase can be used with any model or bot on Poe and work across both the API and Poe chat on web, iOS, Android, Mac, and Windows.

## [Support](https://creator.poe.com/docs/external-applications/openai-compatible-api\#support)

Feel free to [reach out to support](mailto:developers@poe.com) if you come across some unexpected behavior when using our API or have suggestions for future improvements.

On this page

[Chat Completions API](https://creator.poe.com/docs/external-applications/openai-compatible-api#chat-completions-api) [Responses API](https://creator.poe.com/docs/external-applications/openai-compatible-api#responses-api) [Basic Usage](https://creator.poe.com/docs/external-applications/openai-compatible-api#basic-usage) [Reasoning](https://creator.poe.com/docs/external-applications/openai-compatible-api#reasoning) [Web Search](https://creator.poe.com/docs/external-applications/openai-compatible-api#web-search) [Structured Outputs](https://creator.poe.com/docs/external-applications/openai-compatible-api#structured-outputs) [Multi-turn Conversations](https://creator.poe.com/docs/external-applications/openai-compatible-api#multi-turn-conversations) [Migration from Chat Completions](https://creator.poe.com/docs/external-applications/openai-compatible-api#migration-from-chat-completions) [Known Issues & Limitations](https://creator.poe.com/docs/external-applications/openai-compatible-api#known-issues--limitations) [Bot Availability](https://creator.poe.com/docs/external-applications/openai-compatible-api#bot-availability) [Media Bot Recommendations](https://creator.poe.com/docs/external-applications/openai-compatible-api#media-bot-recommendations) [Parameter Handling](https://creator.poe.com/docs/external-applications/openai-compatible-api#parameter-handling) [Additional Considerations](https://creator.poe.com/docs/external-applications/openai-compatible-api#additional-considerations) [API behavior](https://creator.poe.com/docs/external-applications/openai-compatible-api#api-behavior) [Detailed OpenAI Compatible API Support](https://creator.poe.com/docs/external-applications/openai-compatible-api#detailed-openai-compatible-api-support) [Request fields](https://creator.poe.com/docs/external-applications/openai-compatible-api#request-fields) [Response fields](https://creator.poe.com/docs/external-applications/openai-compatible-api#response-fields) [Error message compatibility](https://creator.poe.com/docs/external-applications/openai-compatible-api#error-message-compatibility) [Header compatibility](https://creator.poe.com/docs/external-applications/openai-compatible-api#header-compatibility) [Getting Started](https://creator.poe.com/docs/external-applications/openai-compatible-api#getting-started) [Streaming](https://creator.poe.com/docs/external-applications/openai-compatible-api#streaming) [File Inputs](https://creator.poe.com/docs/external-applications/openai-compatible-api#file-inputs) [Migration checklist (OpenAI → Poe in 60 s)](https://creator.poe.com/docs/external-applications/openai-compatible-api#migration-checklist-openai--poe-in-60-s) [Pricing & Availability](https://creator.poe.com/docs/external-applications/openai-compatible-api#pricing--availability) [Support](https://creator.poe.com/docs/external-applications/openai-compatible-api#support)