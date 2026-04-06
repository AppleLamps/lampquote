---
url: "https://creator.poe.com/docs/api-bots/overview"
title: "Overview | Poe Creator Platform"
---

# Overview

Copy for LLMView as Markdown

# API Bots

API Bots let you make your AI models available to users on Poe by connecting your Chat Completions API or Responses API compatible endpoint. When a user sends a message to your bot, Poe proxies the request to your endpoint and streams the response back.

## [How API Bots Work](https://creator.poe.com/docs/api-bots/overview\#how-api-bots-work)

1. You configure a bot with your endpoint's base URL, model name, and API key
2. A user sends a message to your bot on Poe
3. Poe forwards the message to your Chat Completions API (or Responses API) endpoint
4. Your endpoint returns a response, which Poe streams back to the user
5. Poe charges the user based on the token usage reported by your endpoint and the pricing you configured

API Bots support:

- **Multiple input modalities** — text, image, and video (video is only supported with the Chat Completions API)
- **Tool use** — function calling through the Chat Completions API
- **Custom parameter controls** — UI controls (toggles, dropdowns, sliders) that let users adjust parameters passed to your endpoint
- **Tiered pricing** — different rates for standard and long-context inputs

## [Creating API Bots](https://creator.poe.com/docs/api-bots/overview\#creating-api-bots)

You can create and manage API Bots using the [Bots REST API](https://creator.poe.com/docs/api-bots/bots-rest-api).

### [Quick Example](https://creator.poe.com/docs/api-bots/overview\#quick-example)

```
curl -X POST "https://api.poe.com/bots" \
  -H "Authorization: Bearer $POE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "handle": "MyBot",
    "description": "My custom model on Poe",
    "api_bot_settings": {
      "model_name": "my-model",
      "base_url": "https://api.example.com/v1",
      "api_key": "'"$MY_API_KEY"'",
      "input_modalities": ["text"],
      "output_modalities": ["text"],
      "pricing": {
        "prompt": "0.000001",
        "completion": "0.000004"
      }
    }
  }'
```

## [Key Configuration](https://creator.poe.com/docs/api-bots/overview\#key-configuration)

| Setting | Description |
| --- | --- |
| `model_name` | Model name passed to your endpoint (e.g. `"model-id"`, `"example-provider/model-1"`) |
| `base_url` | Base URL of your Chat Completions API endpoint |
| `api_key` | API key used when calling your endpoint |
| `api_type` | API format: `"chat_completions_api"` or `"responses_api"` |
| `pricing` | Per-token costs used to charge users for messages |

For the full configuration reference, see the [Bots REST API documentation](https://creator.poe.com/docs/api-bots/bots-rest-api#api-bot-settings).

## [Pricing](https://creator.poe.com/docs/api-bots/overview\#pricing)

Poe chat messages are charged based on the token usage returned by your API response and the pricing values you configure. Prices are specified as dollar cost per single token (e.g. `"0.000003"` for $0.000003/token).

You can also configure different rates for different context length ranges using `context_pricing`, which lets you define multiple pricing tiers based on input token count.

## [Parameter Controls](https://creator.poe.com/docs/api-bots/overview\#parameter-controls)

API Bots can expose custom UI controls to users — such as toggle switches, dropdowns, and sliders — that adjust parameters passed to your endpoint. For example, you could add a "Enable Thinking" toggle that sets `extra_body.enable_thinking` on the Chat Completions request.

For details, see [Parameter Controls](https://creator.poe.com/docs/server-bots/parameter-controls) and the [param\_definitions reference](https://creator.poe.com/docs/api-bots/bots-rest-api#parameter-definitions).

## [Limitations](https://creator.poe.com/docs/api-bots/overview\#limitations)

Some settings are not yet available through the API and must be configured on poe.com:

- Bot profile pictures
- Private bot sharing
- Related recommendations settings
- Bot handle changes after creation

On this page

[How API Bots Work](https://creator.poe.com/docs/api-bots/overview#how-api-bots-work) [Creating API Bots](https://creator.poe.com/docs/api-bots/overview#creating-api-bots) [Quick Example](https://creator.poe.com/docs/api-bots/overview#quick-example) [Key Configuration](https://creator.poe.com/docs/api-bots/overview#key-configuration) [Pricing](https://creator.poe.com/docs/api-bots/overview#pricing) [Parameter Controls](https://creator.poe.com/docs/api-bots/overview#parameter-controls) [Limitations](https://creator.poe.com/docs/api-bots/overview#limitations)